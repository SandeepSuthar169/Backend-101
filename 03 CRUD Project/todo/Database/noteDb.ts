export interface Note {
  id: number;
  title: string;
  description: string;
}

export let notes: Note[] = [
  {
    id: 1,
    title: "Learn Node.js",
    description:
      "Embedded below is essentially the simplest Express app you can create. It is a single file app — not what you’d get if you use the Express generator, which creates the scaffolding for a full app with numerous JavaScript files, Jade templates, and sub-directories for various purposes.",
  },
  {
    id: 2,
    title: "Learn Express.js",
    description:
      "Adding the capability to connect databases to Express apps is just a matter of loading an appropriate Node.js driver for the database in your app. This document briefly explains how to add and use some of the most popular Node.js modules for database systems in your Express app:",
  },
];
