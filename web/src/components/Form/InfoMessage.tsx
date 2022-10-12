import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle, XCircle } from "phosphor-react";
import { COLORS, defaultButtonBackground, defaultButtonStyle } from "../Utils";

interface InfoMessageProps {
  title: string;
  message: string;
  type: "success" | "error" | string;
}

export function InfoMessage({ title, message, type }: InfoMessageProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2A2634] outline-none py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25 flex flex-col items-center gap-4 ">
        <Dialog.Title className="flex justify-center text-3xl font-black">
          {title}
        </Dialog.Title>
        {type === "success" ? (
          <CheckCircle size={120} color={COLORS.GREEN} />
        ) : (
          <XCircle size={120} className={COLORS.RED} />
        )}
        <Dialog.Description className="mt-2 text-lg">
          {message}
        </Dialog.Description>

        <footer className="mt-2 flex justify-end gap-4">
          <Dialog.Close
            className={`${defaultButtonStyle} ${defaultButtonBackground}`}
          >
            Fechar
          </Dialog.Close>
        </footer>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
