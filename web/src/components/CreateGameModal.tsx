import * as Dialog from "@radix-ui/react-dialog";
import {
  GameController,
  MagnifyingGlass,
  XCircle,
  CircleNotch,
} from "phosphor-react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Game } from "../App";
import {
  defaultButtonBackground,
  defaultButtonStyle,
  disabledButton,
} from "./utils";
import Loader from "./Loader";

const DefaultGame: NewGameProps = {
  id: 0,
  title: "",
  bannerUrl: "",
  slug: "",
};
interface NewGameProps {
  id: number;
  title: string;
  bannerUrl: string;
  slug: string;
}

export function CreateGameModal({ games, handleCreateGame }: any) {
  let start = true;
  const [title, setTitle] = useState<NewGameProps["title"]>("");
  const [bannerUrl, setBannerUrl] = useState<NewGameProps["bannerUrl"]>("");
  const [validImage, setValidImage] = useState(true);
  const [searchGames, setSearchGames] = useState([]);
  const [loadingGame, setLoadingGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState<NewGameProps>(DefaultGame);

  function cleanStates() {
    setTitle("");
    setBannerUrl("");
    setValidImage(true);
  }

  useEffect(() => {
    if (start) {
      cleanStates();
      start = false;
    }
  }, []);

  function CreateGame() {
    const gameExists =
      games.filter((gameItem: Game) => gameItem?.title === selectedGame.title)
        .length > 0;

    if (gameExists) {
      alert("Já existe um jogo com esse nome!");
      return;
    }

    handleCreateGame(selectedGame.title, selectedGame.bannerUrl);
    cleanStates();
  }

  const getGameInfo = useCallback(
    async (event: any) => {
      event.preventDefault();
      setSearchGames([]);
      setLoadingGame(true);

      if (selectedGame.title !== "") {
        setSelectedGame(DefaultGame);
      }

      try {
        await axios(
          `https://api.rawg.io/api/games?key=d206b7771d2c4a538612c9922ee4785e&search=${title}`
        ).then((res) => {
          const gamesList = res?.data?.results;
          if (gamesList.length > 1) {
            setSearchGames(
              gamesList.map((item: any) => ({
                id: item.id,
                title: item.name,
                bannerUrl: item.background_image,
                slug: item.slug,
              }))
            );
          }
        });
        setLoadingGame(false);
      } catch (error) {
        console.log("ERROR API", error);
        setLoadingGame(false);
      }
    },
    [title]
  );

  function handleSelectedGame(game: any) {
    setLoadingGame(true);
    setSelectedGame(game);
    setLoadingGame(false);
  }

  // async function CreateGame(event: FormEvent) {
  //   event.preventDefault();

  //   // const gameExists =
  //   //   games.filter((gameItem: Game) => gameItem?.title === title).length > 0;

  //   // if (gameExists) {
  //   //   alert("Já existe um jogo com esse nome!");
  //   //   return;
  //   // }

  //   // handleCreateGame(title, bannerUrl);
  // }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2A2634] outline-none py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25 ">
        <Dialog.Title className="text-3xl font-black">
          Cadastre um novo jogo
        </Dialog.Title>
        <form onSubmit={getGameInfo} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Título do game</label>
            <div className="flex gap-2 align-middle w-full">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="ex.: Overwatch 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-900 py-3 px-4 rounded text-sm outline-none placeholder:text-zinc-800 w-full"
              />
              <button
                type="submit"
                className={`${defaultButtonStyle} ${
                  title.length === 0 ? disabledButton : defaultButtonBackground
                } `}
                disabled={title.length === 0}
                onClick={getGameInfo}
              >
                <MagnifyingGlass className="w-6 h-6" />
              </button>
            </div>
          </div>

          {loadingGame ? (
            <div className="h-60 flex items-center">
              <Loader />
            </div>
          ) : (
            searchGames.length > 0 &&
            (selectedGame.title.length === 0 ? (
              <div className="h-60 overflow-y-auto overflow-x-clip scrollbar">
                {searchGames?.map((game: any) => {
                  return (
                    <div
                      onClick={() => handleSelectedGame(game)}
                      className="max-h-8 my-2 hover:text-violet-500 hover:cursor-pointer"
                    >
                      {game.title}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className=" font-semibold">{selectedGame.title}</div>
                  <button
                    className="flex"
                    onClick={() => {
                      setSelectedGame(DefaultGame);
                    }}
                  >
                    <XCircle className="w-6 h-6 hover:text-red-700" />
                  </button>
                </div>
                <img
                  src={selectedGame.bannerUrl}
                  alt="Game Banner Preview"
                  onError={() => setValidImage(false)}
                  className="w-full object-contain rounded-lg "
                />
              </div>
            ))
          )}
        </form>

        <footer className="mt-4 flex justify-end gap-4">
          <Dialog.Close
            className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 hover:translate-y-1"
            onClick={cleanStates}
          >
            Cancelar
          </Dialog.Close>
          <button
            type="button"
            className={`${defaultButtonStyle} ${
              selectedGame.title === ""
                ? disabledButton
                : defaultButtonBackground
            }`}
            disabled={selectedGame.title === ""}
            onClick={CreateGame}
          >
            <GameController className="w-6 h-6" />
            Cadastrar
          </button>
        </footer>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
