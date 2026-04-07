"use client";

import React from "react";

/**
 * Text analysis input form with text area and attachment popover for file/URL.
 * Validates input and triggers analysis via callback.
 */

import { useCallback, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Plus, FileText, Loader2, X, Globe, Link2 } from "lucide-react";

interface TextInputFormProps {
  onAnalyze: (text: string, language: string) => void;
  onFileAnalyze: (file: File, language: string) => void;
  onUrlAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

type AttachmentType = "file" | "url" | null;

export function TextInputForm({
  onAnalyze,
  onFileAnalyze,
  onUrlAnalyze,
  isAnalyzing,
}: TextInputFormProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("langproof-analysis-language") || "auto";
    }
    return "auto";
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState<AttachmentType>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("langproof-analysis-language", language);
  }, [language]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const hasAttachment = selectedFile !== null || url.trim() !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // If file is attached, analyze file
    if (selectedFile) {
      onFileAnalyze(selectedFile, language);
      return;
    }

    // If URL is attached, analyze URL
    if (url.trim()) {
      const trimmedUrl = url.trim();
      if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
        toast.error(t.analyze.urlInvalid);
        return;
      }
      onUrlAnalyze(trimmedUrl);
      return;
    }

    // Otherwise analyze text
    if (text.length < MIN_TEXT_LENGTH) {
      toast.error(`${t.analyze.textTooShort} ${MIN_TEXT_LENGTH} ${t.analyze.chars}`);
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      toast.error(`${t.analyze.textTooLong} ${MAX_TEXT_LENGTH.toLocaleString()} ${t.analyze.chars}`);
      return;
    }
    onAnalyze(text, language);
  }

  function validateAndSetFile(file: File) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`${t.analyze.fileTooLarge} ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    setSelectedFile(file);
    setUrl("");
    setAttachmentType("file");
    setPopoverOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  function handleAttachUrl() {
    setAttachmentType("url");
    setSelectedFile(null);
    setPopoverOpen(false);
  }

  function handleAttachFile() {
    fileInputRef.current?.click();
  }

  function clearAttachment() {
    setSelectedFile(null);
    setUrl("");
    setAttachmentType(null);
  }

  const canSubmit =
    !isAnalyzing &&
    (selectedFile !== null ||
      url.trim() !== "" ||
      charCount >= MIN_TEXT_LENGTH);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.analyze.textAnalysis}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.analyze.textAnalysisDesc}
          </p>
        </div>
        <div className="w-40">
          <Label htmlFor="language-select" className="sr-only">
            {t.analyze.language}
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t.analyze.autoDetect}</SelectItem>
              <SelectItem value="ru">{t.analyze.russian}</SelectItem>
              <SelectItem value="kk">{t.analyze.kazakh}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Attachment display */}
        {attachmentType === "file" && selectedFile && (
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearAttachment}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t.analyze.remove}</span>
            </Button>
          </div>
        )}

        {attachmentType === "url" && (
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div className="relative w-full">
              <input
                type="url"
                placeholder={t.analyze.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="
                  peer
                  w-full
                  bg-transparent
                  p-0
                  pb-1

                  text-sm
                  text-muted-foreground
                  placeholder:text-muted-foreground

                  outline-none
                "
              />

              <span
                className="
                  pointer-events-none
                  absolute left-0 bottom-0
                  h-[2px] w-0
                  bg-primary

                  transition-all duration-300
                  peer-focus:w-full
                "
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearAttachment}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t.analyze.remove}</span>
            </Button>
          </div>
        )}

        {/* Text area */}
        <div
          className="relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Textarea
            placeholder={
              hasAttachment
                ? t.analyze.attachmentAddedHint
                : t.analyze.textPlaceholder
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-y bg-background pr-12 text-sm leading-relaxed
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border 
              hover:scrollbar-thumb-muted-foreground"
            maxLength={MAX_TEXT_LENGTH}
            disabled={hasAttachment}
          />

          {/* Plus button for attachments */}
          <div className="absolute bottom-3 right-3">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  disabled={hasAttachment}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">{t.analyze.addAttachment}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start gap-2 text-sm"
                    onClick={handleAttachFile}
                  >
                    <FileText className="h-4 w-4" />
                    {t.analyze.attachFile}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start gap-2 text-sm"
                    onClick={handleAttachUrl}
                  >
                    <Globe className="h-4 w-4" />
                    {t.analyze.attachUrl}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_EXTENSIONS}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {!hasAttachment && (
              <>
                <span>
                  {wordCount} {t.analyze.words} / {charCount} {t.analyze.characters}
                </span>
                <span className="mx-2">|</span>
                <span>
                  {t.analyze.minChars} {MIN_TEXT_LENGTH} {t.analyze.chars}
                </span>
              </>
            )}
            {hasAttachment && attachmentType === "file" && (
              <span>{t.analyze.fileAttached}</span>
            )}
            {hasAttachment && attachmentType === "url" && (
              <span>{t.analyze.urlAttached}</span>
            )}
          </div>
          <Button type="submit" disabled={!canSubmit} className="gap-2">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.analyze.analyzing}
              </>
            ) : (
              t.analyze.analyzeBtn
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
