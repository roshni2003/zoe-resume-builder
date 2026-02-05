import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { SparkleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAIStore } from "@/integrations/ai/store";
import { orpc } from "@/integrations/orpc/client";
import { Button } from "./button";

type AIGenerateButtonProps = {
	type: "experience" | "projects" | "summary" | "custom";
	data: Record<string, unknown>;
	onGenerated: (content: string) => void;
	disabled?: boolean;
	className?: string;
};

export function AIGenerateButton({ type, data, onGenerated, disabled, className }: AIGenerateButtonProps) {
	const { enabled: isAIEnabled, provider, model, apiKey, baseURL } = useAIStore();

	const { mutate: generateContent, isPending } = useMutation(orpc.ai.generateContent.mutationOptions());

	const isConfigured = apiKey && model;

	const handleGenerate = () => {
		if (!isConfigured) {
			toast.error(t`AI is not configured. Please add your API key and model in Settings → AI.`);
			return;
		}

		if (!isAIEnabled) {
			toast.warning(t`AI is disabled in settings, but attempting to generate anyway...`);
		}

		const toastId = toast.loading(t`Generating content with AI...`);

		generateContent(
			{
				provider,
				model,
				apiKey,
				baseURL,
				type,
				data,
			},
			{
				onSuccess: (content) => {
					toast.success(t`Content generated successfully!`, { id: toastId });
					onGenerated(content);
				},
				onError: (error) => {
					toast.error(error.message || t`Failed to generate content`, { id: toastId });
				},
			},
		);
	};

	// Only disable if not configured or pending, ignore the enabled flag for better UX
	const isDisabled = disabled || isPending || !isConfigured;
	const buttonTitle = !isConfigured
		? "Configure AI in Settings → AI (add API key and model)"
		: isPending
			? "Generating..."
			: "Generate content with AI";

	return (
		<Button
			type="button"
			size="sm"
			variant="outline"
			onClick={handleGenerate}
			disabled={isDisabled}
			className={className}
			title={buttonTitle}
		>
			<SparkleIcon className="size-4" />
			<Trans>Generate with AI</Trans>
		</Button>
	);
}
