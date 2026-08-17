import type { Metadata } from "next";
import { pastEvents } from "@/lib/events";
import EventDetailClient from "./EventDetailClient";

type PageProps = {
  params:
    | {
        id: string;
      }
    | Promise<{
    id: string;
      }>;
};

async function resolveEventId(params: PageProps["params"]) {
  const resolved = await params;
  return resolved.id.toLowerCase().trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const eventId = await resolveEventId(params);
  const event = pastEvents.find((item) => item.id === eventId);

  if (!event) {
    return {
      title: "Event Not Found — E-Cell BVCOENM",
      description: "The requested event could not be found in the E-Cell archive.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pageTitle = `${event.title} — E-Cell BVCOENM`;

  return {
    title: pageTitle,
    description: event.shortDescription,
    alternates: {
      canonical: `/events/${event.id}`,
    },
    openGraph: {
      title: pageTitle,
      description: event.shortDescription,
      type: "article",
      images: event.coverImage ? [{ url: event.coverImage, alt: event.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: event.shortDescription,
      images: event.coverImage ? [event.coverImage] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const eventId = await resolveEventId(params);
  const event = pastEvents.find((item) => item.id === eventId);

  return <EventDetailClient event={event} />;
}
