// Shared by the shell (loads the script on page load) and RichTextEditor.
// The original's custom CKEditor 5 build, downloaded unchanged from the staging origin.
export const CKEDITOR_SRC = "/lib/ckeditor5-default/build/ckeditor.js";
export const CKEDITOR_SCRIPT_ID = "ckeditor5-default";

// Same config scriptminigame.js passes to CKSource.Editor.create (initializeDetailHtml*)
export const MINIGAME_EDITOR_CONFIG = {
  removePlugins: ["Title"],
  placeholder: "ระบุเงื่อนไขมินิเกมส์",
  style: {
    definitions: [{ name: "เงาตัวอักษร", element: "p", classes: ["custom-text-shadow-style"] }],
  },
};
