import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Check, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceOption {
  voice_id: string;
  name: string;
  description: string;
  tags: string[];
}

const RECOMMENDED_VOICES: VoiceOption[] = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Warm, professional female voice. Clear British accent.",
    tags: ["Female", "British", "Professional"],
  },
  {
    voice_id: "29vD33N1CtxCmqQRPOHJ",
    name: "Drew",
    description: "Confident, articulate male voice. American accent.",
    tags: ["Male", "American", "Confident"],
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    description: "Soft yet authoritative female voice. Versatile accent.",
    tags: ["Female", "Neutral", "Authoritative"],
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    description: "Warm, engaging male voice. Slightly European accent.",
    tags: ["Male", "European", "Warm"],
  },
  {
    voice_id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Emily",
    description: "Calm, measured female voice. Perfect for feedback.",
    tags: ["Female", "British", "Calm"],
  },
  {
    voice_id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    description: "Deep, commanding male voice. American accent.",
    tags: ["Male", "American", "Commanding"],
  },
];

const PREVIEW_TEXT =
  "Welcome to Voice3. I'm your Shadow Coach, and together we'll master the language of leadership.";

interface VoiceSelectorProps {
  onSelect?: (voiceId: string) => void;
  selectedVoiceId?: string;
  compact?: boolean;
}

export default function VoiceSelector({
  onSelect,
  selectedVoiceId: externalSelected,
  compact = false,
}: VoiceSelectorProps) {
  const [selected, setSelected] = useState(
    externalSelected || localStorage.getItem("v3_preferred_voice") || "21m00Tcm4TlvDq8ikWAM"
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const handleSelect = (voiceId: string) => {
    setSelected(voiceId);
    localStorage.setItem("v3_preferred_voice", voiceId);
    onSelect?.(voiceId);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPlayingId(null);
  };

  const handlePreview = async (voiceId: string) => {
    if (playingId === voiceId) {
      stopAudio();
      return;
    }

    stopAudio();
    setLoadingId(voiceId);

    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
        body: { text: PREVIEW_TEXT, voiceId },
      });

      if (error) throw error;

      const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlayingId(null);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPlayingId(null);
        setLoadingId(null);
      };

      await audio.play();
      setPlayingId(voiceId);
    } catch (err) {
      console.error("Preview failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={compact ? "" : "max-w-4xl mx-auto"}>
      {!compact && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Choose Your Shadow Coach Voice
          </h2>
          <p className="text-gray-400">
            Select the voice that best represents your ideal executive coach
          </p>
        </div>
      )}

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
        {RECOMMENDED_VOICES.map((voice) => (
          <motion.div
            key={voice.voice_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl p-4 border-2 transition-all cursor-pointer ${
              selected === voice.voice_id
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-gray-700 bg-[#16213e] hover:border-gray-500"
            }`}
            onClick={() => handleSelect(voice.voice_id)}
          >
            {selected === voice.voice_id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7535] flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{voice.name}</h3>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3">{voice.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {voice.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(voice.voice_id);
              }}
              disabled={loadingId === voice.voice_id}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                playingId === voice.voice_id
                  ? "bg-[#D4AF37] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {loadingId === voice.voice_id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : playingId === voice.voice_id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {loadingId === voice.voice_id
                ? "Loading..."
                : playingId === voice.voice_id
                ? "Playing..."
                : "Preview Voice"}
            </button>
          </motion.div>
        ))}
      </div>

      {!compact && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors"
          >
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showMore ? "Show Less" : "Explore More Voices"}
          </button>

          <AnimatePresence>
            {showMore && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-gray-500 text-sm mt-4"
              >
                More voices coming soon. Contact us if you'd like a specific voice style for your team.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
