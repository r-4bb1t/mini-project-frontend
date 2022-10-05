import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Game, Option, Question } from "../../constant/type";
import styles from "../../styles/Home.module.scss";

const Home: NextPage = () => {
  const [data, setData] = useState(null as unknown as Game);
  const [game, setGame] = useState(
    [] as {
      content: string;
      options: Option[];
      index: number;
      isLeft: boolean;
    }[]
  );
  const [endingInfo, setEndingInfo] = useState(0);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const result = (await (
      await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/game/${router.query.gameId}`
      )
    ).json()) as Game;
    setData({
      ...result,
      questions: result.questions.sort((a, b) => a.index - b.index),
    });
  }, [router.query]);

  const fetchEnding = useCallback(
    async (index: number) => {
      const result = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/game/${router.query.gameId}/${index}`
        )
      ).json();
      setEndingInfo(result.count);
    },
    [game]
  );

  useEffect(() => {
    if (data)
      setGame([
        {
          content: data.questions[0].content,
          options: data.questions[0].options,
          index: data.questions[0].index,
          isLeft: true,
        },
      ]);
  }, [data]);

  useEffect(() => {
    if (router.query.gameId) fetchData();
  }, [fetchData, router.query]);

  useEffect(() => {
    if (game.length > 0 && game[game.length - 1].options.length === 0) {
      fetchEnding(game[game.length - 1].index);
    }
    window.scrollTo({ top: document.body.scrollHeight });
  }, [game]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={`${styles.title} ${styles.gametitle}`}>{data?.title}</h1>
        <div className={styles.chats}>
          {game.map((message, index) => (
            <>
              <div
                className={`${styles.bubble} ${
                  message.isLeft ? styles.left : styles.right
                }
                ${
                  message.options.length === 0 &&
                  message.isLeft &&
                  styles.ending
                }`}
                key={index}
              >
                {message.content}
              </div>
            </>
          ))}
        </div>
        {game[game.length - 1]?.options.map((option, optionIndex) => (
          <button
            className={`${styles.option}`}
            key={optionIndex}
            onClick={() =>
              setGame((game) => [
                ...game,
                {
                  content: option.content,
                  options: [],
                  index: -1,
                  isLeft: false,
                },
                {
                  content: data.questions.find((q) => q.index === option.next)
                    .content,
                  options: data.questions.find((q) => q.index === option.next)
                    .options,
                  index: option.next,
                  isLeft: true,
                },
              ])
            }
          >
            {"> "}
            {option.content}
          </button>
        ))}
        {game[game.length - 1]?.options.length === 0 && (
          <div>이 엔딩을 본 사람 수: {endingInfo}</div>
        )}
      </main>
    </div>
  );
};

export default Home;
