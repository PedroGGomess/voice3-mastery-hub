import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const audioCache = new Map<string, ArrayBuffer>();

export function useElevenLabsTTS(voiceId?: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    setIsSpeaking(false);
    // Also stop any browser TTS fallback
    window.speechSynthesis?.cancel();
  }, []);

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Female")
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!text?.trim()) return;

      stop();
      setError(null);
      setIsLoading(true);

      const selectedVoice =
        voiceId || localStorage.getItem("v3_preferred_voice") || "21m00Tcm4TlvDq8ikWAM";
      const cacheKey = `${selectedVoice}:${text.substring(0, 200)}`;

      try {
        let audioBuffer: ArrayBuffer;

        if (audioCache.has(cacheKey)) {
          audioBuffer = audioCache.get(cacheKey)!;
        } else {
          const { data, error: fnError } = await supabase.functions.invoke(
            "elevenlabs-tts",
            {
              body: { text, voiceId: selectedVoice },
            }
          );

          if (fnError) throw new Error(fnError.message);

          if (data instanceof ArrayBuffer) {
            audioBuffer = data;
          } else if (data instanceof Blob) {
            audioBuffer = await data.arrayBuffer();
          } else {
            throw new Error("Unexpected response format");
          }

          // Cache the result
          audioCache.set(cacheKey, audioBuffer);
          // Limit cache size
          if (audioCache.size > 50) {
            const firstKey = audioCache.keys().next().value;
            if (firstKey) audioCache.delete(firstKey);
          }
        }

        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        currentUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setIsLoading(false);
        };
        audio.onended = () => {
          setIsSpeaking(false);
          if (currentUrlRef.current) {
            URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = null;
          }
        };
        audio.onerror = () => {
          console.warn("ElevenLabs audio playback failed, falling back to browser TTS");
          setIsLoading(false);
          speakWithBrowserTTS(text);
        };

        await audio.play();
      } catch (err: any) {
        console.warn("ElevenLabs TTS failed, falling back to browser TTS:", err.message);
        setError(err.message);
        setIsLoading(false);
        speakWithBrowserTTS(text);
      }
    },
    [voiceId, stop, speakWithBrowserTTS]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
}
