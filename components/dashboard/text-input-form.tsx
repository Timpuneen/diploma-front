"use client";

import React from "react"

/**
 * Text analysis input form with text area, file upload, and URL tabs.
 * Validates input and triggers analysis via callback.
 */

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Upload, FileText, Loader2, X, Globe } from "lucide-react";

interface TextInputFormProps {
  onAnalyze: (text: string, language: string) => void;
  onFileAnalyze: (file: File, language: string) => void;
  onUrlAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function TextInputForm({
  onAnalyze,
  onFileAnalyze,
  onUrlAnalyze,
  isAnalyzing,
}: TextInputFormProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  function handleFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error(t.analyze.selectFile);
      return;
    }
    onFileAnalyze(selectedFile, language);
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error(t.analyze.urlEmpty);
      return;
    }
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      toast.error(t.analyze.urlInvalid);
      return;
    }
    onUrlAnalyze(trimmedUrl);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  function validateAndSetFile(file: File) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`${t.analyze.fileTooLarge} ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  }

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

      <Tabs defaultValue="text">
        <TabsList className="mb-4">
          <TabsTrigger value="text" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            {t.analyze.pasteText}
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            {t.analyze.uploadFile}
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <Globe className="h-3.5 w-3.5" />
            {t.analyze.checkUrl}
          </TabsTrigger>
        </TabsList>

        {/* ---- Text tab ---- */}
        <TabsContent value="text">
          <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Textarea
                placeholder={t.analyze.textPlaceholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[240px] resize-y bg-background text-sm leading-relaxed
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border 
                  hover:scrollbar-thumb-muted-foreground"
                maxLength={MAX_TEXT_LENGTH}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {wordCount} {t.analyze.words} / {charCount} {t.analyze.characters}
                </span>
                <span>
                  {t.analyze.minChars} {MIN_TEXT_LENGTH} {t.analyze.chars}, {t.analyze.maxChars}{" "}
                  {MAX_TEXT_LENGTH.toLocaleString()} {t.analyze.chars}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isAnalyzing || charCount < MIN_TEXT_LENGTH}
              className="self-end gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.analyze.analyzing}
                </>
              ) : (
                t.analyze.analyzeTextBtn
              )}
            </Button>
          </form>
        </TabsContent>

        {/* ---- File tab ---- */}
        <TabsContent value="file">
          <form onSubmit={handleFileSubmit} className="flex flex-col gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-background transition-colors hover:border-primary/30"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload file for analysis"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_EXTENSIONS}
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="gap-1 text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                    {t.analyze.remove}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {t.analyze.dropFile}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.analyze.fileTypes} {MAX_FILE_SIZE_MB}MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isAnalyzing || !selectedFile}
              className="self-end gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.analyze.analyzing}
                </>
              ) : (
                t.analyze.analyzeFile
              )}
            </Button>
          </form>
        </TabsContent>

        {/* ---- URL tab ---- */}
        <TabsContent value="url">
          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
            <div className="flex min-h-[240px] flex-col justify-center gap-4 rounded-lg border-2 border-dashed border-border/50 bg-background p-6">
              <div className="flex flex-col items-center gap-3">
                <Globe className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {t.analyze.urlLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.analyze.urlHint}
                  </p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-lg">
                <Input
                  type="url"
                  placeholder={t.analyze.urlPlaceholder}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-card"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isAnalyzing || !url.trim()}
              className="self-end gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.analyze.analyzing}
                </>
              ) : (
                t.analyze.analyzeUrl
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
