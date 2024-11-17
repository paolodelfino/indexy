"use client";
import { ButtonLink } from "@/components/Button";
import {
  Add02,
  InkStroke20Filled,
  SearchSquare,
  Square,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Toolbar({
  variant,
}: {
  variant: "monitor" | "mobile";
}) {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ""}`;
    setUrl(url);
  }, [pathname, searchParams]);

  return (
    <header
      className={cn(
        variant === "mobile" &&
          "fixed bottom-0 max-h-16 w-full max-w-4xl bg-black monitor:hidden",
        variant === "monitor" && "sticky top-0 hidden monitor:block",
      )}
    >
      <nav
        className={cn(
          variant === "mobile" && "overflow-x-auto scrollbar-hidden",
        )}
      >
        <ul className={cn("flex", variant === "monitor" && "flex-col")}>
          <ButtonLink
            href="/?view=big_paint"
            role="listitem"
            color="ghost"
            size="large"
            classNames={{
              button: "py-5",
              text: "text-neutral-300",
            }}
            full={variant === "monitor"}
            icon={<Square />}
          >
            BigPaints
          </ButtonLink>
          <ButtonLink
            href="/?view=inspiration"
            role="listitem"
            color="ghost"
            size="large"
            classNames={{ button: "py-5", text: "text-neutral-300" }}
            full={variant === "monitor"}
            icon={<InkStroke20Filled />}
          >
            Inspirations
          </ButtonLink>
          <Popover placement="left-start">
            <PopoverTrigger
              role="listitem"
              color="ghost"
              size="large"
              classNames={{ button: "py-5", text: "text-neutral-300" }}
              full={variant === "monitor"}
              icon={<Add02 />}
            >
              Create
            </PopoverTrigger>
            <PopoverContent
              className="z-20 flex min-w-16 max-w-[160px] flex-col"
              role="list"
            >
              <ButtonLink
                classNames={{ text: "text-neutral-300" }}
                full
                href={`${isMonitor && !url.startsWith("/create") ? "/redirect?url=" : ""}/create?type=big_paint`}
                // target="_blank"
                role="listitem"
                size="large"
                icon={<Square />}
              >
                BigPaint
              </ButtonLink>
              <ButtonLink
                classNames={{ text: "text-neutral-300" }}
                full
                href={`${isMonitor && !url.startsWith("/create") ? "/redirect?url=" : ""}/create?type=inspiration`}
                // target="_blank"
                role="listitem"
                size="large"
                icon={<InkStroke20Filled />}
              >
                Inspiration
              </ButtonLink>
            </PopoverContent>
          </Popover>
          <Popover placement="left-start">
            <PopoverTrigger
              role="listitem"
              color="ghost"
              size="large"
              classNames={{ button: "py-5", text: "text-neutral-300" }}
              icon={<SearchSquare />}
              full={variant === "monitor"}
            >
              Search
            </PopoverTrigger>
            <PopoverContent
              className="z-20 flex min-w-16 max-w-[160px] flex-col"
              role="list"
            >
              <ButtonLink
                classNames={{ text: "text-neutral-300" }}
                full
                href="/search?type=big_paint"
                role="listitem"
                size="large"
                icon={<Square />}
              >
                BigPaint
              </ButtonLink>
              <ButtonLink
                classNames={{ text: "text-neutral-300" }}
                full
                href="/search?type=inspiration"
                role="listitem"
                size="large"
                icon={<InkStroke20Filled />}
              >
                Inspiration
              </ButtonLink>
            </PopoverContent>
          </Popover>
        </ul>
      </nav>
    </header>
  );
}
