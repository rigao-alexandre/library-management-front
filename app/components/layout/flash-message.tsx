import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { toast } from "sonner";

export const FlashMessageSchema = z.object({
  title: z.string().nullable().optional(),
  message: z.string(),
  variant: z.enum(["default", "destructive"]).nullable().optional(),
  type: z.enum(["success", "info", "warning", "error"]).nullable().optional(),
});
export type FlashMessageSchema = z.infer<typeof FlashMessageSchema>;

export const showFlashMessageToast = (
  data: FlashMessageSchema | null | undefined
): void => {
  const { title, message, type } = data ?? {};

  if (!message) {
    return;
  }

  const fn = type ? toast[type] : toast;

  if (title) {
    fn(title, {
      description: message,
    });
  } else {
    fn(message);
  }
};

export const FlashMessage = ({
  data,
}: {
  data: FlashMessageSchema | null | undefined;
}) => {
  const { title, message, variant } = data ?? {};

  if (!message) {
    return <></>;
  }

  return (
    <Alert variant={variant}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

FlashMessage.displayName = "Flash Message";
