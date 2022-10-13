import * as Dialog from "@radix-ui/react-dialog";
import { MagnifyingGlass } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { Game } from "../App";
import { GameView } from "./GameView/GameView";
import { defaultButtonBackground, defaultButtonStyle } from "./Utils";

interface SearchGameProps {
  games: Game[];
}

export function SearchGame({ games }: SearchGameProps) {
  const [title, setTitle] = useState("");
  const [gameSelected, setGameSelected] = useState<Game | null>(null);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [gamesTitles, setGamesTitles] = useState<Game[] | null | undefined>();

  useEffect(() => {
    setGamesTitles(
      games.filter(
        (game: Game) =>
          game.title.toLowerCase().indexOf(title.toLowerCase()) > -1
      )
    );
  }, [title]);

  useEffect(() => {
    if (gameSelected) {
      setModalOpen(true);
      setTitle("");
      setOpen(false);
    }
  }, [gameSelected]);

  const clearSelectedGame = useCallback(() => {
    setGameSelected(null);
  }, [setGameSelected]);

  return (
    <>
      {modalOpen && (
        <Dialog.Root open={modalOpen} onOpenChange={() => setModalOpen(false)}>
          <GameView
            game={gameSelected}
            open={modalOpen}
            handleModal={() => setModalOpen(false)}
            clearSelectedGame={clearSelectedGame}
          />
        </Dialog.Root>
      )}
      <div
        className="flex gap-2 align-middle w-full transition duration-1000 ease-in-out"
        onMouseLeave={() => setOpen(false)}
        onMouseOver={() => setOpen(true)}
      >
        <div className={`${open ? "w-auto" : "w-[0px] hidden"} `}>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Procure um game"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 h-12 px-4 rounded text-sm outline-none text-white placeholder:text-zinc-600 "
          />
          {title.length > 0 && (
            <div className="absolute z-auto w-[231px] max-h-60 scrollbar overflow-auto bg-zinc-900 px-4 py-2 flex flex-col gap-2">
              {gamesTitles?.length ? (
                gamesTitles?.map((item: Game) => (
                  <span
                    onClick={() => setGameSelected(item)}
                    className="text-white text-sm hover:text-violet-500 hover:cursor-pointer"
                  >
                    {item.title}
                  </span>
                ))
              ) : (
                <span className="text-white text-sm">
                  Nenhum game encontrado
                </span>
              )}
            </div>
          )}
        </div>
        {!open && (
          <button
            type="submit"
            className={`${defaultButtonStyle} ${defaultButtonBackground} `}
            disabled={title.length === 0}
          >
            <MagnifyingGlass className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </>
  );
}
