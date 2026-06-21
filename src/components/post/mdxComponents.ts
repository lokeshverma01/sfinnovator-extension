/**
 * mdxComponents.ts — the set of components made AUTOMATICALLY available inside
 * every MDX post body, with no import needed by the author.
 *
 * The route passes this map to <Content components={...} />. That means in any
 * .mdx post you can write <Callout>, <Steps>/<Step>, <Figure>, <StatusBadge>
 * directly — you never add import lines. (This is the "just write" experience.)
 *
 * To expose a NEW body component to authors: add it here once.
 */
import Callout from "@/components/post/Callout.astro";
import Steps from "@/components/post/Steps.astro";
import Step from "@/components/post/Step.astro";
import Figure from "@/components/post/Figure.astro";
import StatusBadge from "@/components/post/StatusBadge.astro";

export const mdxComponents = {
  Callout,
  Steps,
  Step,
  Figure,
  StatusBadge,
};
