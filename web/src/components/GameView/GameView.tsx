import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { defaultButtonBackground, defaultButtonStyle } from "../Utils";
import { AdsView } from "./AdsView/AdsView";

import axios from "axios";
import { X } from "phosphor-react";

export interface AdProps {
  ad: AdsProps;
}

export interface AdsProps {
  hourEnd: string;
  hoursStart: string;
  id: string;
  name: string;
  useVoiceChannel: boolean;
  weekDays: string[];
  yearsPlaying: number;
}

export function GameView({ game, open, handleModal }: any) {
  const [ads, setAds] = useState<AdsProps[]>([]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 3, spacing: 0, origin: 0 },
      },
    },
    slides: ads.length,
    mode: "free",
  });

  const getAds = useCallback(async () => {
    return await axios(`http://localhost:3333/games/${game.id}/ads`).then(
      (res) => setAds(res.data)
    );
  }, [setAds]);

  useEffect(() => {
    if (open) {
      getAds();
    }
  }, [getAds, open]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content
        onPointerDownOutside={handleModal}
        onEscapeKeyDown={handleModal}
        className="fixed bg-[#2A2634] outline-none text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[880px] h-[500px] shadow-lg shadow-black/25 flex gap-4"
      >
        <div className="w-[350px] rounded-l-lg overflow-hidden">
          <img
            className="w-[350px] h-[500px] object-cover"
            src={game.bannerUrl}
          />
        </div>
        <div className="flex flex-col justify-between py-4 w-[500px]">
          <div>
            <div className="flex justify-between">
              <Dialog.Title className="text-3xl font-black">
                {game.title}
              </Dialog.Title>
              <Dialog.Close className="flex flex-col">
                <X size={32} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-4 text-lg">
              {ads.length ? (
                <div>
                  <span className="font-bold">Anúncios:</span>
                  <div
                    ref={sliderRef}
                    className="flex gap-4 mt-2 overflow-auto cursor-grab active:cursor-grabbing keen-slider"
                  >
                    {ads.map((ad) => (
                      <AdsView key={ad.id} ad={ad} />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="font-bold">Sem anúncios</span>
              )}
            </Dialog.Description>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
