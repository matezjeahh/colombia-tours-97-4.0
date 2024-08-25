"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Név megadása kötelező" }).max(255),
  email: z
    .string()
    .min(1, { message: "Email megadása kötelező" })
    .email({ message: "Érvénytelen email cím" })
    .max(255),
  subject: z.string().optional(),
  message: z
    .string()
    .min(1, { message: "Üzenet megadása kötelező" })
    .max(1000, { message: "Az üzenet nem lehet hosszabb 1000 karakternél" }),
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "El kell fogadnia az adatvédelmi nyilatkozatot",
  }),
});

export function ContactForm({ className, showSubject = false, subject = "", onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: subject,
      message: "",
      acceptPrivacyPolicy: false,
    },
  });

  useEffect(() => {
    form.setValue("subject", subject);
  }, [subject, form]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Üzenet sikeresen elküldve",
          description: "Köszönjük megkeresését! Hamarosan felvesszük Önnel a kapcsolatot.",
        });
        form.reset();
        if (onClose) onClose();
      } else {
        throw new Error("Nem sikerült elküldeni az e-mailt");
      }
    } catch (error) {
      console.error("Hiba az e-mail küldése során:", error);
      toast({
        title: "Hiba történt az üzenet küldése közben",
        description:
          "Sajnáljuk, technikai probléma lépett fel. Kérjük, próbálja újra később vagy vegye fel velünk a kapcsolatot közvetlenül.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Az ön neve</FormLabel>
              <FormControl>
                <Input placeholder="Név" className="text-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" className="text-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSubject && (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tárgy</FormLabel>
                <FormControl>
                  <Input placeholder="Tárgy" className="text-md" {...field} disabled={!!subject} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Üzenet</FormLabel>
              <FormControl>
                <Textarea placeholder="Üzenet" className="text-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptPrivacyPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Elfogadom az{" "}
                  <Link
                    href="/adatvedelmi-iranyelvek"
                    className="underline hover:text-accent-foreground focus:text-accent-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    adatvédelmi nyilatkozatot
                  </Link>
                </FormLabel>
                <FormDescription>
                  Kérjük, olvassa el és fogadja el az adatvédelmi nyilatkozatunkat.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !form.getValues().acceptPrivacyPolicy}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kérem várjon
            </>
          ) : (
            "Küldés"
          )}
        </Button>
      </form>
    </Form>
  );
}
