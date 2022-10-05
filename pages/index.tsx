import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const [state, setState] = useState(0);
  const interval = useRef<NodeJS.Timer>();

  useEffect(() => {
    interval.current = setInterval(() => {
      setState((s) => s + 1);
    }, 500);

    return () => clearInterval(interval.current);
  }, []);

  useEffect(() => {
    if (state > 1) clearInterval(interval.current);
  }, [state]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          대화형
          <br />
          게임
          <br />
          만들기
        </h1>
        <div className={styles.chats}>
          <div className={`${styles.bubble} ${styles.left}`}>
            대화형 게임을 만들어봅시다.
          </div>
          {state > 0 && (
            <div className={`${styles.bubble} ${styles.right}`}>
              시작해볼까요?
            </div>
          )}
          {state > 1 && (
            <Link href="/new">
              <button className={`${styles.option}`}>{"> "}시작하기!</button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
