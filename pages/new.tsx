import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/New.module.scss";
import { Game } from "../constant/type";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      content: "",
      index: 0,
      options: [],
    },
  ] as Game["questions"]);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const result = await (
        await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            questions,
          }),
        })
      ).json();
      router.push(`/game/${result.id}`);
    } catch (e) {
      console.log(e);
      alert("안돼!!!!");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <label>
          <span className={styles.labeltext}>제목</span>
          <input
            className={styles.input}
            placeholder="e.g. 미연시 키우기"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button className={styles.button} onClick={() => handleSubmit()}>
          등록
        </button>
      </header>
      <main className={styles.main}>
        {questions.map((question) => (
          <div key={question.index} className={styles.question_box}>
            <div className={styles.question_title}>질문 {question.index}</div>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={question.content}
              placeholder="질문"
              onChange={(e) =>
                setQuestions((qs) =>
                  qs.map((q, i) => {
                    if (i === question.index) {
                      return { ...q, content: e.target.value };
                    }
                    return q;
                  })
                )
              }
            />
            <div className={styles.divider} />
            {question.options.map((option, optionIndex) => (
              <div key={option._id}>
                <input
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="선택지"
                  onChange={(e) =>
                    setQuestions((qs) =>
                      qs.map((q, i) => {
                        if (i === question.index)
                          return {
                            ...q,
                            options: q.options.map((o, oi) => {
                              if (oi === optionIndex)
                                return {
                                  ...o,
                                  content: e.target.value,
                                };
                              return o;
                            }),
                          };
                        return q;
                      })
                    )
                  }
                />
                <div className={styles.optiontext}>
                  답변 선택 시 질문{" "}
                  <select
                    className={styles.input}
                    onChange={(e) =>
                      setQuestions((qs) =>
                        qs.map((q, i) => {
                          if (i === question.index)
                            return {
                              ...q,
                              options: q.options.map((o, oi) => {
                                if (oi === optionIndex)
                                  return {
                                    ...o,
                                    next: parseInt(e.target.value),
                                  };
                                return o;
                              }),
                            };
                          return q;
                        })
                      )
                    }
                  >
                    {questions.map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  로
                  <button
                    className={styles.closebutton}
                    onClick={() =>
                      setQuestions((qs) =>
                        qs.map((q, i) => {
                          if (i === question.index)
                            return {
                              ...q,
                              options: q.options.filter(
                                (_, oi) => oi !== optionIndex
                              ),
                            };
                          return q;
                        })
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              className={`${styles.button} ${styles.addbutton}`}
              onClick={() =>
                setQuestions((qs) =>
                  qs.map((q, i) => {
                    if (i === question.index)
                      return {
                        ...q,
                        options: [
                          ...q.options,
                          {
                            content: "",
                            next: 0,
                            _id: Math.random().toString(36),
                          },
                        ],
                      };
                    return q;
                  })
                )
              }
            >
              선택지 추가
            </button>
          </div>
        ))}
        <button
          className={`${styles.button} ${styles.addbutton}`}
          onClick={() => {
            setQuestions((qs) => [
              ...qs,
              { content: "질문", options: [], index: qs.length },
            ]);
          }}
        >
          질문 추가
        </button>
      </main>
    </div>
  );
};

export default Home;
