'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { updateAISettings } from '@/services/chatbot.service';

export interface SaveAISettingsState {
  success: boolean;
  message: string;
}

export async function saveAISettings(
  _prevState: SaveAISettingsState | null,
  formData: FormData,
): Promise<SaveAISettingsState> {
  try {
    await requireAdmin();

    const enabled = formData.get('enabled') === 'true';
    const systemPrompt = (formData.get('systemPrompt') as string | null) ?? '';
    const rawLimit = parseInt(formData.get('dailyLimit') as string, 10);
    const dailyLimit = isNaN(rawLimit) ? 20 : Math.max(1, Math.min(200, rawLimit));

    await updateAISettings({ enabled, systemPrompt, dailyLimit });
    revalidatePath('/admin/ai-settings');

    return { success: true, message: 'Settings saved successfully.' };
  } catch {
    return { success: false, message: 'Failed to save settings. Please try again.' };
  }
}
