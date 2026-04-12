import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

type Feature = 'chat' | 'rescue-mode' | 'grammar' | 'qa-gauntlet' | 'simulation' | 'session-feedback' | 'diagnostic' | 'generate-report' | 'professor-prep'

export function useAICoach() {
  const { currentUser } = useAuth()

  const sendMessage = async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    feature: Feature,
    context?: Record<string, unknown>
  ): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('ai-coach', {
      body: { messages, feature, student_id: currentUser?.id, context }
    })
    if (error) throw error
    return data.message as string
  }

  return { sendMessage }
}
