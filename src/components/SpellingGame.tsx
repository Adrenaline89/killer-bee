import { useState, useEffect } from 'react';
import styles from './SpellingGame.module.css';

interface WordLists {
    easy: string[];
    medium: string[];
    hard: string[];
}

export default function SpellingGame() {
    const [currentWord, setCurrentWord] = useState('');
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');
    const [isWordVisible, setIsWordVisible] = useState(true);
    const [words, setWords] = useState<string[]>([]);

    useEffect(() => {
        const wordLists: WordLists = {
            easy: ["apple", "table", "happy"],
            medium: ["journey", "whistle", "puzzle"],
            hard: ["surveillance", "bureaucracy", "idiosyncrasy"]
        };

        if (!localStorage.getItem('wordLists')) {
            localStorage.setItem('wordLists', JSON.stringify(wordLists));
        }

        const difficulty = sessionStorage.getItem('selectedDifficulty') || 'easy';
        const storedWordLists = localStorage.getItem('wordLists') || JSON.stringify(wordLists);
        setWords(JSON.parse(storedWordLists)[difficulty]);
        getNextWord();
    }, []);

    const getNextWord = () => {
        const index = Math.floor(Math.random() * words.length);
        const word = words[index];
        setCurrentWord(word);
        setUserInput('');
        setResult('');
        setIsWordVisible(true);
        setTimeout(() => {
            setIsWordVisible(false);
        }, 1000);
    };

    const checkSpelling = () => {
        if (userInput.trim().toLowerCase() === currentWord) {
            setResult('😊 Correct!');
        } else {
            setResult(`😞 Wrong! The word was: ${currentWord}`);
        }
        setTimeout(getNextWord, 2000);
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.wordDisplay}>
                {isWordVisible ? currentWord : '?????'}
            </div>
            <input
                type="text"
                className={styles.wordInput}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && checkSpelling()}
                placeholder="Type the word here..."
            />
            <button className={styles.submitBtn} onClick={checkSpelling}>
                Check
            </button>
            <div className={styles.result} style={{
                color: result.includes('Correct') ? '#4CAF50' : '#f44336'
            }}>
                {result}
            </div>
        </div>
    );
}
