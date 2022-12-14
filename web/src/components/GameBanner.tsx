import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { GameView } from "./GameView/GameView";
interface GameBannerProps {
  id: string;
  bannerUrl: string;
  title: string;
  adsCount: number;
}

export function GameBanner(props: GameBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Dialog.Root open={modalOpen} onOpenChange={() => setModalOpen(false)}>
      <GameView
        game={props}
        open={modalOpen}
        handleModal={() => setModalOpen(false)}
      />
      <div
        onClick={() => setModalOpen(true)}
        className="relative rounded-lg overflow-hidden keen-slider__slide cursor-grab active:cursor-grabbing"
      >
        <img
          src={props.bannerUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="w-full pt-16 pb-4 px-4 bg-game-gradient absolute bottom-0 left-0 right-0">
          <strong className="font-bold text-white block">{props.title}</strong>
          <span className="text-zinc-300 text-sm block">
            {props.adsCount} anúncio(s)
          </span>
        </div>
      </div>
    </Dialog.Root>
  );
}
