/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useImageUpload } from "@/hooks/use-image-upload";
import { getErrorMessage, useUpdateToken } from "@/hooks/use-token";
import { Token, UpdateTokenDto } from "@/types/token";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Pencil, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be between 2-100 characters" })
    .max(100, { message: "Name must be between 2-100 characters" }),
  symbol: z
    .string()
    .min(1, { message: "Symbol must be between 1-20 characters" })
    .max(20, { message: "Symbol must be between 1-20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Symbol must contain only letters and numbers",
    })
    .transform((val) => val.toUpperCase()),
  totalSupply: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Total supply must be a valid number",
    }),
  priceUsd: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Price must be a valid number",
    }),
  website: z.string().optional(),
  logo: z.string().optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must not exceed 1000 characters" }),
});

interface EditTokenProps {
  token: Token;
  disabled?: boolean;
}

export default function EditToken({ token, disabled }: EditTokenProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateTokenMutation = useUpdateToken();
  const imageUploadMutation = useImageUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      totalSupply: "",
      priceUsd: "",
      website: "",
      logo: "",
      description: "",
    },
  });

  // Populate form when token data is available
  useEffect(() => {
    if (token) {
      form.reset({
        name: token.name || "",
        symbol: token.symbol || "",
        totalSupply: token.totalSupply ? token.totalSupply.toString() : "",
        priceUsd: token.priceUsd ? token.priceUsd.toString() : "",
        website: token.website || "",
        logo: token.logo || "",
        description: token.description || "",
      });
      setLogoPreview(token.logo || null);
    }
  }, [token, form]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);

      try {
        const publicUrl = await imageUploadMutation.mutateAsync(file);
        form.setValue("logo", publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image. Please try again.");
        handleRemoveLogo();
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue("logo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tokenData: UpdateTokenDto = {
        ...values,
        totalSupply: values.totalSupply ? parseFloat(values.totalSupply) : 0,
        priceUsd: values.priceUsd ? parseFloat(values.priceUsd) : 0,
        website: values.website || "",
      };

      await updateTokenMutation.mutateAsync({ id: token.id, data: tokenData });
      toast.success("Token updated successfully");

      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update token");
      console.error("Failed to update token:", getErrorMessage(error as any));
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form to original values when closing
      if (token) {
        form.reset({
          name: token.name || "",
          symbol: token.symbol || "",
          totalSupply: token.totalSupply ? token.totalSupply.toString() : "",
          priceUsd: token.priceUsd ? token.priceUsd.toString() : "",
          website: token.website || "",
          logo: token.logo || "",
          description: token.description || "",
        });
        setLogoPreview(token.logo || null);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Token</DialogTitle>
          <DialogDescription>
            Update the details for this token.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          placeholder="Enter token name"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Symbol <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          placeholder="Enter token symbol"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          rows={3}
                          placeholder="Enter token description"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Logo
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <div className="space-y-3">
                        {/* Logo Preview */}
                        {logoPreview ? (
                          <div className="relative inline-block">
                            <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                              onClick={handleRemoveLogo}
                              disabled={updateTokenMutation.isPending}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={
                              imageUploadMutation.isPending ||
                              updateTokenMutation.isPending
                            }
                            className="flex items-center gap-2"
                          >
                            {imageUploadMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                {logoPreview ? "Change Logo" : "Upload Logo"}
                              </>
                            )}
                          </Button>
                          <span className="text-xs text-gray-500">
                            PNG, JPG up to 5MB
                          </span>
                        </div>

                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={updateTokenMutation.isPending}
                        />
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Total Supply <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          type="number"
                          placeholder="Enter total supply"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceUsd"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Price (USD) <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          type="number"
                          step="0.00000001"
                          placeholder="Enter price in USD"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <FormLabel className="text-left sm:text-right">
                      Website
                    </FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={updateTokenMutation.isPending}
                          type="url"
                          placeholder="Enter website URL"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateTokenMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateTokenMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Token"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
