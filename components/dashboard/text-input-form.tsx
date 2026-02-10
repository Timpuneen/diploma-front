"use client";

import React from "react"

/**
 * Text analysis input form with text area and file upload tabs.
 * Validates input and triggers analysis via callback.
 */

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";
import { Upload, FileText, Loader2, X } from "lucide-react";

interface TextInputFormProps {
  onAnalyze: (text: string, language: string) => void;
  onFileAnalyze: (file: File, language: string) => void;
  isAnalyzing: boolean;
}

export function TextInputForm({
  onAnalyze,
  onFileAnalyze,
  isAnalyzing,
}: TextInputFormProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.length < MIN_TEXT_LENGTH) {
      toast.error(t("analyzeTextMinError").replace("{min}", String(MIN_TEXT_LENGTH)));
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      toast.error(t("analyzeTextMaxError").replace("{max}", String(MAX_TEXT_LENGTH)));
      return;
    }
    onAnalyze(text, language);
  }

  function handleFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error(t("analyzeSelectFile"));
      return;
    }
    onFileAnalyze(selectedFile, language);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  function validateAndSetFile(file: File) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(t("analyzeFileSizeError").replace("{size}", String(MAX_FILE_SIZE_MB)));
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
            {t("analyzeTextAnalysis")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("analyzeTextAnalysisDesc")}
          </p>
        </div>
        <div className="w-40">
          <Label htmlFor="language-select" className="sr-only">
            {t("langSwitcherLabel")}
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t("langAuto")}</SelectItem>
              <SelectItem value="ru">{t("langRussian")}</SelectItem>
              <SelectItem value="kk">{t("langKazakh")}</SelectItem>
              <SelectItem value="en">{t("langEnglish")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="text">
        <TabsList className="mb-4">
          <TabsTrigger value="text" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            {t("analyzePasteText")}
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            {t("analyzeUploadFile")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Textarea
                placeholder={t("analyzeTextPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[240px] resize-y bg-background text-sm leading-relaxed"
                maxLength={MAX_TEXT_LENGTH}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {wordCount} {t("analyzeWords")} / {charCount} {t("analyzeChars")}
                </span>
                <span>
                  {t("analyzeMinChars")} {MIN_TEXT_LENGTH}, {t("analyzeMaxChars")}{" "}
                  {MAX_TEXT_LENGTH.toLocaleString()}
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
                  {t("analyzeAnalyzing")}
                </>
              ) : (
                t("analyzeSubmitText")
              )}
            </Button>
          </form>
        </TabsContent>

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
                    {t("analyzeRemove")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {t("analyzeDropFile")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("analyzeFileFormats")} {MAX_FILE_SIZE_MB}MB
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
                  {t("analyzeAnalyzing")}
                </>
              ) : (
                t("analyzeSubmitFile")
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
