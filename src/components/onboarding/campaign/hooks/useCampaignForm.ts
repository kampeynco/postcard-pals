import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../types";
import { OnboardingData } from "../../hooks/useOnboardingState";

export const useCampaignForm = (onNext: () => void, defaultValues?: OnboardingData) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: defaultValues?.committee_name || "",
      committee_type: defaultValues?.committee_type as any || "candidate",
      candidate_name: defaultValues?.candidate_name || "",
      office_sought: defaultValues?.office_sought as any || undefined,
      disclaimer_text: defaultValues?.disclaimer_text || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);
    onNext();
  };

  return {
    form,
    onSubmit,
  };
};