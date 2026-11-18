// Data for the shell (top bar badges, user, support button).
// Pages call this instead of reading the mock, so a real fetch() can replace the body later.
import { shellMock } from "@/lib/mock/shell";

export type ShellData = typeof shellMock;

export async function getShellData(): Promise<ShellData> {
  return shellMock;
}
