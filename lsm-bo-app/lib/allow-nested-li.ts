// The original sidebar nests <li> directly inside <li> (its MenuItem component renders an <li>
// inside the group's <li>). React's development build reports that as an error on every render,
// which Next.js shows as "Issues". Only those two messages are silenced, only in development.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const [message, a, b] = args;
    if (typeof message === "string") {
      if (message.startsWith("In HTML, %s cannot be a descendant of <%s>") && a === "<li>" && b === "li") return;
      if (message.startsWith("<%s> cannot contain a nested %s") && a === "li" && b === "<li>") return;
    }
    original(...args);
  };
}

export {};
