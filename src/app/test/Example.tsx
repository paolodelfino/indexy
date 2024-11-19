"use client";

import Button, { ButtonLink } from "@/components/Button";

export default function Example() {
  return (
    <div className="">
      <Button color="default" disabled={false}>
        color=default, disabled=false
      </Button>
      <Button color="default" disabled={true}>
        color=default, disabled=true
      </Button>
      <Button color="ghost" disabled={false}>
        color=ghost, disabled=false
      </Button>
      <Button color="ghost" disabled={true}>
        color=ghost, disabled=true
      </Button>
      <Button color="accent" disabled={false}>
        color=accent, disabled=false
      </Button>
      <Button color="accent" disabled={true}>
        color=accent, disabled=true
      </Button>
      <Button color="danger" disabled={false}>
        color=danger, disabled=false
      </Button>
      <Button color="danger" disabled={true}>
        color=danger, disabled=true
      </Button>
      <Button
        color="default"
        classNames={{ button: "data-[disabled=false]:hover:!bg-yellow-500" }}
      >
        color=default
      </Button>
      <ButtonLink href="/" color="default" data-disabled={false}>
        color=default, data-disabled=false
      </ButtonLink>
      <ButtonLink href="/" color="default" data-disabled={true}>
        color=default, data-disabled=true
      </ButtonLink>
      <ButtonLink href="/" color="ghost" data-disabled={false}>
        color=ghost, data-disabled=false
      </ButtonLink>
      <ButtonLink href="/" color="ghost" data-disabled={true}>
        color=ghost, data-disabled=true
      </ButtonLink>
      <ButtonLink href="/" color="accent" data-disabled={false}>
        color=accent, data-disabled=false
      </ButtonLink>
      <ButtonLink href="/" color="accent" data-disabled={true}>
        color=accent, data-disabled=true
      </ButtonLink>
      <ButtonLink href="/" color="danger" data-disabled={false}>
        color=danger, data-disabled=false
      </ButtonLink>
      <ButtonLink href="/" color="danger" data-disabled={true}>
        color=danger, data-disabled=true
      </ButtonLink>
      <ButtonLink
        href="/"
        color="default"
        classNames={{ button: "data-[disabled=false]:hover:!bg-yellow-500" }}
      >
        color=default
      </ButtonLink>
      <Button classNames={{ button: "pointer-events-none" }}>a</Button>
    </div>
  );
}
