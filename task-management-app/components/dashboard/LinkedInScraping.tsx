"use client";

import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { scrapeLinkedInProfile } from "@/lib/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

export default function LinkedInScraping() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      linkedinUrl: user?.linkedinUrl || "",
      profileImage: "",
    },
  });

  const linkedinUrl = watch("linkedinUrl");

  const handleScrapeLinkedIn = useCallback(
    async (data: { linkedinUrl: string }) => {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      if (!data.linkedinUrl) {
        setError("Please provide a LinkedIn URL");
        return;
      }

      try {
        setScrapingLoading(true);
        setError("");

        if (user && user.id) {
          const response = await dispatch(
            scrapeLinkedInProfile({
              linkedInUrl: data.linkedinUrl,
              userId: user.id,
            })
          );

          if (response.payload && response.payload.user) {
            const scrapedUser = response.payload.user;
            setValue("linkedinUrl", scrapedUser.linkedInProfileUrl || "");
            setValue("profileImage", scrapedUser.linkedInProfileImage || "");
          }
        } else {
          setError("User ID is missing.");
        }
      } catch (err) {
        setError("Failed to scrape LinkedIn profile");
      } finally {
        setScrapingLoading(false);
      }
    },
    [dispatch, user, setValue]
  );

  return (
    <div className="space-y-4 p-8">
      <form onSubmit={handleSubmit(handleScrapeLinkedIn)} className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
          <Input
            id="linkedinUrl"
            {...register("linkedinUrl")}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={scrapingLoading || !linkedinUrl}
        >
          {scrapingLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Scrape LinkedIn"
          )}
        </Button>
      </form>
    </div>
  );
}
