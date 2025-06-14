<?php

namespace Classes;

use Exception;
use Base;
use PDO;

class LanguageAudio
{
    protected $language = null;
    protected $audioPath = '';
    protected $appPath = '';
    protected $appName = '';    

    // Check if google translate audio is supported for the given language
    protected $supportedLanguages = [
        'fi' => 'Finnish',
        'sv' => 'Swedish',
        // Add more languages as needed
    ];

    public function __construct(string $language, string $app_path, string $audio_path, string $app_name) {
        $this->language = $language;
        $this->appPath = $app_path;
        $this->audioPath = $audio_path;
        $this->appName = $app_name;
    }

    public function updateAudio() {
        $language = $this->language;

        // Get the latest words from the database for the specified language
        $db = new PDO('sqlite:'.$this->appPath.'data/'.$this->appName.'_db.sqlite');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get the latest words from the database for the specified language
        $stmt = $db->prepare("SELECT LOWER(GROUP_CONCAT(q.foreign_phrase, ' '))
        FROM questions q
        JOIN lessons l ON q.lesson_id = l.id
        JOIN courses c ON c.id = l.course_id
        WHERE c.language = :language;");

        $stmt->execute([':language' => $language]);
        $latest_words = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $latest_words = implode(' ', $latest_words); // Convert array to string
        $latest_words = str_replace(['...', '.', ',', '!', '?', '(', ')', '"', "'"], '', $latest_words);
        $latest_words = mb_strtolower($latest_words, 'UTF-8'); // Convert to lowercase with UTF-8 encoding
        $latest_words = explode(' ', $latest_words);
        $latest_words = array_unique($latest_words); // Remove duplicate words
        $latest_words = array_filter($latest_words, function($word) {
            return !empty(trim($word)); // Remove empty words, JIC
        });

        // Load existing words from the file

        $existing_words_file_path = $this->audioPath . $language . '/' . $language . '_existing.txt';
        $existing_words = file_exists($existing_words_file_path) ? file_get_contents($existing_words_file_path) : '';
        $existing_words = explode(' ', $existing_words) ?? [];

        // Remove duplicate words from existing words

        $new_words = array_diff($latest_words, $existing_words);

        // Save new words as audio files

        foreach ($new_words as $word) {
            sleep(1);
            $word = urlencode($word);
            $url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=$language&client=tw-ob&q=$word";

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0'); // Required to avoid 403
            $audioData = curl_exec($ch);
            curl_close($ch);

            $filename = $this->audioPath . $language . "/mp3/" . urldecode($word) . "_$language" . ".mp3";
            file_put_contents($filename, $audioData);
            echo "Saved $filename\n";
        }

        // Append new words to existing words file

        $existing_words = array_merge($existing_words, $new_words);
        file_put_contents($this->audioPath . $language .'/'. $language . '_existing.txt', implode(' ', $existing_words));
    }

}