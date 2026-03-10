// Toolkit history helper — thin wrapper over the persistence layer

import { saveToolkitEntry, getToolkitHistory as _getHistory, ToolkitEntry } from "./persistence";

export type { ToolkitEntry };

export function saveToolHistory(
  toolId: string,
  toolName: string,
  input: string,
  output: string,
  userId: string
): void {
  saveToolkitEntry(userId, {
    toolId,
    toolName,
    inputs: { input },
    outputs: { result: output },
  });
}

export function getToolHistory(userId: string, toolId?: string): ToolkitEntry[] {
  return _getHistory(userId, toolId);
}
