import * as Preact from "https://unpkg.com/preact@latest?module";
import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

import { words } from "./words.js";

const h = Preact.h;

const HangmanWordLetter = props => {
    const { guessed, letter } = props;

    if (letter === " ") return h("div", { className: "space" });
    else if (guessed.includes(letter)) return h("div", { className: "letter correct" }, letter);
    else return h("div", { className: "letter" }, "?"); 
};

const HangmanWord = props => {
    const { guessed, word } = props;

    return h("div", { id: "hangman-word" }, Array.from(word).map(letter => h(HangmanWordLetter, { guessed, letter })));
};

const HangmanButtonLetter = props => {
    const { guessed, word, guess, letter } = props;

    if (!guessed.includes(letter)) return h("button", { className: "hangman-button-letter", onClick: event => guess(letter) }, letter)
    else if (word.includes(letter)) return h("button", { className: "hangman-button-letter correct", disabled: true }, letter);
    else return h("button", { className: "hangman-button-letter incorrect", disabled: true }, letter);
};

const HangmanButtonsRow = props => {
    const { guessed, word, guess, letters } = props;

    return h("div", { className: "hangman-buttons-row" }, letters.map(letter => h(HangmanButtonLetter, { guessed, word, guess, letter })));
};

const HangmanButtons = props => {
    const { guessed, word, guess } = props;

    return h("div", { id: "hangman-buttons" }, [
        h(HangmanButtonsRow, { guessed, guess, word, letters: Array.from("qwertyuiop") }),
        h(HangmanButtonsRow, { guessed, guess, word, letters: Array.from("asdfghjkl") }),
        h(HangmanButtonsRow, { guessed, guess, word, letters: Array.from("zxcvbnm") })
    ])
};

const HangmanChances = props => {
    const { chances } = props;

    return h("div", { id: "hangman-chances" }, [
        Array(5).fill().map((_, i) => h("div", { className: `chance ${i < chances ? "correct" : "incorrect"}` }))
    ]);
};

const Hangman = props => {
    const [isPlaying, setPlaying] = useState(false);
    const [status, setStatus] = useState("playing");
    const [chances, setChances] = useState(0);
    const [word, setWord] = useState("");
    const [guessed, setGuessed] = useState([]);

    const start = () => {
        setPlaying(true);
        setStatus("playing");
        setWord(words[Math.floor(Math.random() * words.length)]);
        setChances(5);
        setGuessed([]);
    };

    const guess = letter => {
        const nextGuessed = [...guessed, letter];
        setGuessed(nextGuessed);

        if (!word.includes(letter)) {
            if (chances === 0) {
                setStatus("lost");
            }
            else {
                setChances(chances - 1);
            }
        }
        else {
            const letters = Array.from(word).filter(character => character !== " ");

            if (letters.every(letter => nextGuessed.includes(letter))) {
                setStatus("won");
            }
        }
    };

    const reveal = () => {
        setGuessed(Array.from(new Set(word)));
    };

    return h("div", { id: "hangman" }, [
        isPlaying ? [
            h(HangmanWord, { guessed, word }),
            h(HangmanChances, { chances }),
            status === "playing" ? [
                h(HangmanButtons, { guessed, word, guess }),
            ]
            : status === "lost" ? [
                h("h1", {}, "You lost."),
                h("button", { onClick: event => reveal() }, "Reveal"),
                h("button", { onClick: event => start() }, "Try again?")
            ]
            : status === "won" ? [
                h("h1", {}, "You won."),
                h("button", { onClick: event => start() }, "Try again?")
            ]
            : h("h1", {}, "You broke the game.")
        ]
        : [
            h("h1", {}, "Hangman"),
            h("button", { onClick: event => start() }, "Start")
        ]
    ]);
};

Preact.render(
    h(Hangman, {}),
    document.body
);