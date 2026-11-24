# DeepSeek Models Discount Time

An OpenCode skill and plugin that tells you whether DeepSeek API tokens are at full price or half price right now, based on Beijing time. It prints a red or green circle and plain text: `🔴 Discount OFF` during peak at full price, `🟢 Discount ON` off-peak at half price, plus the time of the next edge. The text stays readable even if the emoji does not render.

## What it is

DeepSeek charges peak rates Monday to Friday, 09:00-12:00 and 14:00-18:00 Beijing time (UTC+8), excluding Chinese public holidays. Every other hour is off-peak and costs half. The same windows in UTC are 01:00-04:00 and 06:00-10:00, Monday to Friday.

The repo contains:

- `deepseek-peak/peak.mjs`: prints the current window and the next edge in Beijing and local time, and exits 2 for peak or 0 for off-peak.
- `deepseek-peak/index.mjs`: the OpenCode plugin. It adds the current window to every model request and registers the skill, so the assistant starts every reply with one line: `🟢 Discount ON` or `🔴 Discount OFF` with the next edge.
- `deepseek-peak/SKILL.md`: the skill. When you ask about token cost, peak hours, or the best time for a long task, the assistant runs the script and reports the window.
- `deepseek-peak/peak.test.mjs`: tests for the time windows, weekends, holidays, and the next change.

The script reads your computer clock, so the edge time is also shown in your local timezone when it differs from Beijing.

Pricing source: https://api-docs.deepseek.com/quick_start/pricing

## Install

Requirements: OpenCode V2. Node 18 or newer is needed only for running the status script by hand.

1. Clone the repo into a permanent folder. Do not clone into a temp directory, `C:\Program Files`, or the OpenCode cache, and do not move the folder after installing. Windows example:

```sh
git clone https://github.com/Closegamer/deepseek-models-discount-time C:\a_REPOS\deepseek-models-discount-time
```

macOS and Linux example:

```sh
git clone https://github.com/Closegamer/deepseek-models-discount-time ~/opencode/deepseek-models-discount-time
```

2. Add the plugin folder to `plugins` in your global `~/.config/opencode/opencode.json` or in a project `opencode.json`. On Windows, run this from the repo folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Add `-Config C:\path\to\opencode.json` for a project config. An existing file is backed up to `opencode.json.bak`. Or edit the file by hand:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["C:/a_REPOS/deepseek-models-discount-time/deepseek-peak"]
}
```

macOS and Linux:

```jsonc
"plugins": ["/home/you/opencode/deepseek-models-discount-time/deepseek-peak"]
```

Use an absolute path. A relative path is resolved from the directory where OpenCode runs, so it can break when you switch projects.

OpenCode reloads configuration on save, no restart needed. The plugin registers the skill too, so no separate `skills` entry is required.

3. Check the script:

```sh
node C:/a_REPOS/deepseek-models-discount-time/deepseek-peak/peak.mjs # Windows
node ~/opencode/deepseek-models-discount-time/deepseek-peak/peak.mjs # macOS and Linux
```

Example output:

```text
🟢 Discount ON, half price, Beijing 07:42 Tue, local 02:42 Tue. Next edge 09:00 Beijing, 04:00 local, in 1h 18m. Green light.
```

4. Start a new session. Every reply should start with the `🟢 Discount ON` or `🔴 Discount OFF` line.

To uninstall, remove the entry from `plugins` and reload.

### Skill only, without the automatic line

Drop `plugins` and add the repo root as a skill source instead:

```jsonc
"skills": ["C:/a_REPOS/deepseek-models-discount-time"]
```

or on macOS and Linux:

```jsonc
"skills": ["/home/you/opencode/deepseek-models-discount-time"]
```

The assistant then loads `deepseek-peak` when you ask about price, peak hours, or timing of a long task.

## Usage

- Ask "is now a good time to run a long task?" or mention `@deepseek-peak`.
- Run the script directly: exit code 2 means peak, 0 means off-peak.

## Holiday table

Peak hours skip Chinese public holidays. The table in `peak.mjs` covers 2026 and 2027. Add the next year's State Council dates each November. Without that update, holidays in later years are treated as normal weekdays.

## Updates

```sh
git pull
```

The plugin path does not change.

---

# Время скидок на модели DeepSeek

Скилл и плагин для OpenCode, которые показывают, действует ли сейчас полная цена на токены DeepSeek или половина, по пекинскому времени. Выводит красный или зелёный кружок и текст: `🔴 Discount OFF` означает полную цену, `🟢 Discount ON` означает скидку 50%, плюс время следующей смены. Текст читается, даже если эмодзи не отображается.

## Что это

DeepSeek берёт полную цену с понедельника по пятницу, 09:00-12:00 и 14:00-18:00 по пекинскому времени (UTC+8), кроме государственных праздников Китая. Всё остальное время действует скидка 50%. В UTC это 01:00-04:00 и 06:00-10:00, с понедельника по пятницу.

В репозитории:

- `deepseek-peak/peak.mjs`: печатает текущее окно и время следующей смены по Пекину и по местному времени, код выхода 2 для пика и 0 для скидки.
- `deepseek-peak/index.mjs`: плагин OpenCode. Добавляет текущее окно в каждый запрос к модели и регистрирует скилл, поэтому каждый ответ начинается со строки `🟢 Discount ON` или `🔴 Discount OFF` и времени следующей смены.
- `deepseek-peak/SKILL.md`: сам скилл. Когда вы спрашиваете про цену токенов, часы пика или лучшее время для долгой задачи, ассистент запускает скрипт и сообщает окно.
- `deepseek-peak/peak.test.mjs`: тесты окон, выходных, праздников и времени следующей смены.

Скрипт читает системные часы компьютера и показывает время смены также в вашем местном часовом поясе, если он отличается от Пекина.

Источник правил: https://api-docs.deepseek.com/quick_start/pricing

## Установка

Нужен OpenCode V2. Node 18 или новее требуется только для ручного запуска скрипта.

1. Клонируйте репозиторий в постоянную папку. Не клонируйте во временную папку, `C:\Program Files` или кеш OpenCode, и не перемещайте папку после установки. Пример для Windows:

```sh
git clone https://github.com/Closegamer/deepseek-models-discount-time C:\a_REPOS\deepseek-models-discount-time
```

Пример для macOS и Linux:

```sh
git clone https://github.com/Closegamer/deepseek-models-discount-time ~/opencode/deepseek-models-discount-time
```

2. Добавьте папку плагина в `plugins` в глобальном `~/.config/opencode/opencode.json` или в проектном `opencode.json`. В Windows запустите из папки репозитория:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Для проектного конфига добавьте `-Config C:\path\to\opencode.json`. Существующий файл сохраняется в `opencode.json.bak`. Либо отредактируйте файл вручную:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["C:/a_REPOS/deepseek-models-discount-time/deepseek-peak"]
}
```

macOS и Linux:

```jsonc
"plugins": ["/home/you/opencode/deepseek-models-discount-time/deepseek-peak"]
```

Используйте абсолютный путь. Относительный путь считается от папки, в которой запущен OpenCode, и может сломаться при смене проекта.

OpenCode перечитывает конфигурацию при сохранении, перезапуск не нужен. Плагин сам регистрирует скилл, отдельная запись `skills` не требуется.

3. Проверьте скрипт:

```sh
node C:/a_REPOS/deepseek-models-discount-time/deepseek-peak/peak.mjs # Windows
node ~/opencode/deepseek-models-discount-time/deepseek-peak/peak.mjs # macOS and Linux
```

Пример вывода:

```text
🟢 Discount ON, half price, Beijing 07:42 Tue, local 02:42 Tue. Next edge 09:00 Beijing, 04:00 local, in 1h 18m. Green light.
```

4. Начните новую сессию. Каждый ответ должен начинаться со строки `🟢 Discount ON` или `🔴 Discount OFF`.

Чтобы удалить, уберите запись из `plugins` и перезагрузите конфигурацию.

### Только скилл, без автоматической строки

Уберите `plugins` и добавьте корень репозитория как источник скиллов:

```jsonc
"skills": ["C:/a_REPOS/deepseek-models-discount-time"]
```

или для macOS и Linux:

```jsonc
"skills": ["/home/you/opencode/deepseek-models-discount-time"]
```

Ассистент будет загружать `deepseek-peak`, когда вы спросите про цену, часы пика или время долгой задачи.

## Как пользоваться

- Спросите "сейчас хорошее время для долгой задачи?" или упомяните `@deepseek-peak`.
- Или запустите скрипт вручную: код 2 означает пик, код 0 означает скидку.

## Таблица праздников

Часы пика не действуют в государственные праздники Китая. Таблица в `peak.mjs` покрывает 2026 и 2027 годы. Каждый ноябрь добавляйте даты следующего года из постановления Госсовета КНР. Без обновления праздники следующих лет будут считаться обычными рабочими днями.

## Обновление

```sh
git pull
```

Путь к плагину не меняется.

---

writtenBy('Closegamer', 2026)