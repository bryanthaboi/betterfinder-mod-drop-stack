import { locations, operations, storage, ui } from "betterfinder";
import type { ActivateHandler, CommandResult, CommandRunHandler, FileRef, UINode } from "betterfinder";

const KEY = "stack";
const MAX_ITEMS = 128;

const plain = (value: unknown): any => JSON.parse(JSON.stringify(value));

async function load(): Promise<FileRef[]> {
  const stored = await storage.get(KEY);
  return Array.isArray(stored) ? (stored as unknown as FileRef[]) : [];
}

async function save(items: FileRef[]): Promise<void> {
  await storage.set(KEY, plain(items));
}

async function render(items: FileRef[]): Promise<void> {
  const body: UINode[] = [
    { type: "text", text: items.length === 0 ? "stack is empty" : items.length + " on the stack", label: "Stack size" },
  ];
  if (items.length > 0) {
    body.push({
      type: "list",
      label: "Stashed items",
      items: items.map((item, index) => ({ id: "item" + index, title: item.name, subtitle: item.kind })),
    });
    body.push({
      type: "hstack",
      children: [
        { type: "button", text: "Copy here", label: "Copy the stack into the folder u are in", command: "drop-copy" },
        { type: "button", text: "Move here", label: "Move the stack into the folder u are in", command: "drop-move" },
        { type: "button", text: "Clear", label: "Clear the stack", command: "clear-stack" },
      ],
    });
  } else {
    body.push({ type: "button", text: "Stash selection", label: "Add the selection to the stack", command: "stash-selection" });
  }
  await ui.setPanel("stack", { type: "vstack", children: body });
}

async function drop(move: boolean): Promise<CommandResult> {
  const items = await load();
  if (items.length === 0) {
    return { message: "the stack is empty, stash something first" };
  }
  const here = await locations.current();
  const destination = here.folder ?? (await ui.pickDestination(move ? "Move the stack into..." : "Copy the stack into..."));
  if (destination === null) {
    return {};
  }
  try {
    const ticket = move
      ? await operations.move(items, destination, "rename")
      : await operations.copy(items, destination, "rename");
    await save([]);
    await render([]);
    return { operationId: ticket.operationId, message: (move ? "moving " : "copying ") + items.length + " items to " + (here.folder ? here.title : destination.name) };
  } catch (error) {
    return { message: "couldnt drop the stack, restash the files and try again" };
  }
}

export const activate: ActivateHandler = async (context, input) => {
  await render(await load());
};

export const stashSelection: CommandRunHandler = async (context, input) => {
  if (input.selection.length === 0) {
    return { message: "select something to stash first" };
  }
  const stack = await load();
  const seen = new Set(stack.map(item => item.handle));
  for (const item of input.selection) {
    if (!seen.has(item.handle) && stack.length < MAX_ITEMS) {
      stack.push(item);
      seen.add(item.handle);
    }
  }
  await save(stack);
  await render(stack);
  return { message: "stack is at " + stack.length };
};

export const dropCopy: CommandRunHandler = async (context, input) => drop(false);

export const dropMove: CommandRunHandler = async (context, input) => drop(true);

export const clearStack: CommandRunHandler = async (context, input) => {
  await save([]);
  await render([]);
  return { message: "stack cleared" };
};
