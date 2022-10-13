import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { AdsView } from "./AdsView/AdsView";

import axios from "axios";
import { X } from "phosphor-react";
import Loader from "../Loader";
import { Game } from "../../App";
export interface AdsProps {
  hourEnd: string;
  hoursStart: string;
  id: string;
  name: string;
  useVoiceChannel: boolean;
  weekDays: string[];
  yearsPlaying: number;
}

interface GameViewProps {
  game: any;
  open: boolean;
  handleModal: () => void;
  clearSelectedGame?: () => void;
}

export function GameView({
  game,
  open,
  handleModal,
  clearSelectedGame = () => {},
}: GameViewProps) {
  const [ads, setAds] = useState<AdsProps[]>([]);
  const [gameInfo, setGameInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 3, spacing: 0, origin: 0 },
      },
    },
    slides: ads.length,
    mode: "free",
  });

  const getGameInfo = async () => {
    try {
      await axios(
        `https://api.rawg.io/api/games?key=d206b7771d2c4a538612c9922ee4785e&search=${game.title}`
      ).then((res) => {
        setGameInfo(res.data.results[0]);
        setLoading(false);
      });
    } catch (error) {
      setError("Não foi possível informações do game");
      setLoading(false);
    }
  };

  const closeModal = () => {
    clearSelectedGame();
    handleModal();
  };

  const getAds = useCallback(async () => {
    try {
      return await axios(`http://localhost:3333/games/${game.id}/ads`).then(
        (res) => setAds(res.data)
      );
    } catch {
      setError("Não foi possível carregar os anúncios");
    }
  }, [setAds]);

  const handleScoreStyle = () => {
    if (gameInfo.metacritic === null) {
      return `bg-violet-600`;
    } else if (gameInfo.metacritic > 70) {
      return `bg-[#038C3E]`;
    } else if (gameInfo.metacritic > 50) {
      return `bg-[#F2C94C]`;
    } else {
      return `bg-[#B91C1C]`;
    }
  };

  useEffect(() => {
    if (open) {
      getGameInfo();
      getAds();
    }
  }, [getAds, open]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content
        onPointerDownOutside={closeModal}
        onEscapeKeyDown={closeModal}
        className="fixed bg-[#2A2634] outline-none text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[880px] h-[500px] shadow-lg shadow-black/25 flex gap-4"
      >
        <div className="w-[350px] rounded-l-lg overflow-hidden">
          <img
            className="w-[350px] h-[500px] object-cover"
            src={game.bannerUrl}
          />
        </div>
        {loading ? (
          <div className="flex w-[500px]">
            <Loader size={"lg"} />
          </div>
        ) : (
          <div className="flex flex-col justify-between py-4 w-[500px]">
            <div>
              {Object.values(gameInfo).length > 0 && (
                <>
                  <div className="flex justify-between">
                    <Dialog.Title className="text-3xl font-black">
                      {game.title}
                      <span className="ml-2 text-sm font-light">
                        {gameInfo.released.substr(0, 4)}
                      </span>
                    </Dialog.Title>
                    <Dialog.Close
                      className="flex flex-col"
                      onClick={() => setError("")}
                    >
                      <X size={32} className="hover:text-violet-500" />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="text-lg">
                    <div className="flex gap-1 my-2 items-center flex-wrap">
                      <div
                        className={`h-7 w-7 flex items-center justify-center rounded-md ${handleScoreStyle()}`}
                      >
                        <span className="font-bold text-sm">
                          {gameInfo.metacritic || "?"}
                        </span>
                      </div>
                      {`\u2022`}

                      <div className="flex">
                        {gameInfo.genres.map((genre: any, index: number) => (
                          <span
                            className={`whitespace-nowrap ${
                              gameInfo.genres.length >= 4
                                ? "text-sm"
                                : "text-md"
                            }`}
                          >
                            {genre.name}
                            {index !== gameInfo.genres.length - 1 &&
                              `,${`\u00A0`}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="leading-[0] mt-3">
                      <span className="text-sm font-bold">
                        Plataformas: {""}
                      </span>
                      {gameInfo.platforms.map(
                        ({ platform }: any, index: number) => (
                          <span className="text-sm">
                            {platform.name}
                            {index !== gameInfo.platforms.length - 1 && `, `}
                          </span>
                        )
                      )}
                    </div>
                    {ads.length ? (
                      <div className="mt-6">
                        <span className="font-bold">Anúncios:</span>
                        <div
                          ref={sliderRef}
                          className="flex gap-4 mt-2 overflow-auto cursor-grab active:cursor-grabbing keen-slider"
                        >
                          {ads.map((ad) => (
                            <AdsView key={ad.id} ad={ad} setError={setError} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-[360px]">
                        <span className="font-bold">Sem anúncios</span>
                      </div>
                    )}
                    {error !== "" && (
                      <span className="flex justify-center">{error}</span>
                    )}
                  </Dialog.Description>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
