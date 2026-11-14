// <lord-icon> is the web component from /assets/js/pages/plugins/lord-icon-2.1.0.js (loaded by the shell).
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        colors?: string;
        delay?: string | number;
      };
    }
  }
}
