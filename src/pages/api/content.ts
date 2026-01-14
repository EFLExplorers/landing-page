import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export interface ContentItem {
  id: string;
  content_type: string;
  slug?: string;
  title: string;
  subtitle?: string;
  description?: string;
  content: Record<string, any>;
  metadata?: Record<string, any>;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Backward compatibility interfaces
export interface PricingTier extends ContentItem {
  content: {
    price: string;
    period: string;
    description: string;
    is_featured?: boolean;
  };
}

export interface Service extends ContentItem {
  description: string;
  content: {
    icon: string;
    background_icons: string[];
  };
}

export interface LearningTool extends ContentItem {
  description: string;
  content: {
    icon: string;
  };
}

export interface FAQ extends ContentItem {
  description: string;
  content: {
    category: string;
  };
}

type ContentType =
  | "pricing"
  | "pricing_plan"
  | "service"
  | "learning_tool"
  | "faq"
  | "team_member"
  | "about_stat"
  | "core_value"
  | "student_character"
  | "student_planet"
  | "teaching_tool"
  | "lesson_module"
  | "teacher_benefit"
  | "testimonial";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | PricingTier[]
    | Service[]
    | LearningTool[]
    | FAQ[]
    | { error: string }
  >
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, category } = req.query;

  if (!type || typeof type !== "string") {
    return res.status(400).json({ error: "Type parameter is required" });
  }

  try {
    let query = supabase
      .from("content_items")
      .select(
        "id, content_type, slug, title, subtitle, description, content, sort_order, active"
      )
      .eq("content_type", type)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    // Handle special filtering for FAQs by category
    if (type === "faq" && category && typeof category === "string") {
      query = query.eq("content.category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Content fetch error for ${type}:`, error);
      return res.status(500).json({ error: `Failed to fetch ${type}` });
    }

    res.status(200).json(data || []);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}