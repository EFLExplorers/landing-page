import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export interface PageSection {
  id: string;
  section_key: string;
  section_type: string;
  title?: string;
  subtitle?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  cta_label?: string;
  cta_href?: string;
  content: Record<string, any>;
  data?: Record<string, any>;
  settings?: Record<string, any>;
  sort_order: number;
  active: boolean;
}

export interface PageContent {
  id: string;
  route: string;
  title?: string;
  meta_description?: string;
  sections: PageSection[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PageContent | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { route } = req.query;

  if (!route || typeof route !== "string") {
    return res.status(400).json({ error: "Route parameter is required" });
  }

  try {
    // Fetch page data
    const { data: pageData, error: pageError } = await supabase
      .from("pages")
      .select("id, route, title, meta_description")
      .eq("route", route)
      .single();

    if (pageError) {
      console.error("Page fetch error:", pageError);
      return res.status(404).json({ error: "Page not found" });
    }

    // Fetch page sections
    const { data: sectionsData, error: sectionsError } = await supabase
      .from("page_sections")
      .select(
        "id, section_key, section_type, title, subtitle, heading, subheading, body, cta_label, cta_href, content, data, settings, sort_order, active"
      )
      .eq("page_id", pageData.id)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (sectionsError) {
      console.error("Sections fetch error:", sectionsError);
      return res.status(500).json({ error: "Failed to fetch page sections" });
    }

    const pageContent: PageContent = {
      id: pageData.id,
      route: pageData.route,
      title: pageData.title,
      meta_description: pageData.meta_description,
      sections: sectionsData || [],
    };

    res.status(200).json(pageContent);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
