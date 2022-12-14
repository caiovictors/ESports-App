import { useCallback, useEffect, useState } from "react";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

import Logo from "./assets/logo_nlw.svg";
import * as Dialog from "@radix-ui/react-dialog";

import { GameBanner } from "./components/GameBanner";
import { CreateAdBanner } from "./components/CreateAdBanner";
import { CreateAdModal } from "./components/CreateAdModal";

import axios from "axios";

import "./styles/main.css";
import { CreateGameModal } from "./components/CreateGameModal";
import { GameController } from "phosphor-react";
import { InfoMessage } from "./components/Form/InfoMessage";
import Loader from "./components/Loader";
import { SearchGame } from "./components/SearchGame";
export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

const defaultInfoModal = {
  title: "",
  message: "",
  type: "",
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [openCreateGameModal, setOpenCreateGameModal] = useState(false);
  const [openCreateAdModal, setOpenCreateAdModal] = useState(false);
  const [infoModal, setInfoModal] = useState(defaultInfoModal);
  const [loading, setLoading] = useState(false);

  const animation = { duration: 50000, easing: (t: number) => t };
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 3, spacing: 5, origin: 0 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 6, spacing: 1, origin: 0 },
      },
    },
    created(s) {
      s.moveToIdx(5, true);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    slides: games.length,
    mode: "free",
    vertical: false,
  });

  async function handleCreateGame(title: string, bannerUrl: string) {
    try {
      setLoading(true);
      await axios
        .post("http://localhost:3333/games", {
          title,
          bannerUrl,
        })
        .then(() => {
          setLoading(false);
          setInfoModal({
            title: "Sucesso!",
            message: "Game cadastrado com sucesso!",
            type: "success",
          });
          getGames();
        });
    } catch (error) {
      setLoading(false);
      setInfoModal({
        title: "Erro!",
        message: "Ocorreu um erro ao cadastrar o game",
        type: "error",
      });
    }
  }

  const getGames = useCallback(async () => {
    return await axios("http://localhost:3333/games").then((res) =>
      setGames(res.data)
    );
  }, []);

  useEffect(() => {
    getGames();
  }, [getGames]);

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center mb-18 mt-8">
      <div className="flex justify-between w-full max-w-[1220px] sm:px-10 xl:px-0 ">
        <SearchGame games={games} />
        <Dialog.Root
          open={openCreateGameModal}
          onOpenChange={setOpenCreateGameModal}
        >
          <Dialog.Trigger className="ml-20 py-3 px-4 bg-violet-500 hover:bg-violet-700 hover:translate-y-1  text-white rounded flex items-center gap-3 w-60">
            <GameController className="w-6 h-6" />
            <span className="whitespace-nowrap">Cadastrar game</span>
          </Dialog.Trigger>
          <CreateGameModal
            games={games}
            handleCreateGame={handleCreateGame}
            handleModal={() => setOpenCreateGameModal(false)}
            handleInfoModal={setInfoModal}
          />
        </Dialog.Root>
      </div>
      <div className="flex flex-row mt-12">
        <img src={Logo} alt="Logo" />
      </div>
      <h1 className="text-6xl text-white font-black mt-10 text-center">
        Seu{" "}
        <span className="bg-nlw-gradient bg-clip-text text-transparent">
          duo
        </span>{" "}
        est?? aqui.
      </h1>

      <div className="flex flex-col sm:w-[90%] sm:mx-10 ">
        <div
          ref={sliderRef}
          className="grid grid-cols-6 gap-6 mt-16 keen-slider"
        >
          {games.map((game) => {
            return (
              <GameBanner
                key={game.id}
                id={game.id}
                title={game.title}
                bannerUrl={game.bannerUrl}
                adsCount={game._count.ads}
              />
            );
          })}
        </div>

        <Dialog.Root
          open={openCreateAdModal}
          onOpenChange={setOpenCreateAdModal}
        >
          <CreateAdBanner />
          <CreateAdModal
            getGames={getGames}
            games={games}
            handleModal={() => setOpenCreateAdModal(false)}
            handleInfoModal={setInfoModal}
            setLoading={setLoading}
          />
        </Dialog.Root>
      </div>
      <Dialog.Root
        open={Object.values(infoModal)[0] !== ""}
        onOpenChange={() => setInfoModal(defaultInfoModal)}
      >
        <InfoMessage
          title={infoModal.title}
          message={infoModal.message}
          type={infoModal.type}
        />
      </Dialog.Root>
      {loading && (
        <div className="absolute z-10 flex top-0 left-0 bg-black w-full h-full opacity-40">
          <Loader size="lg" />
        </div>
      )}
    </div>
  );
}

export default App;
