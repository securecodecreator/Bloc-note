document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.getElementById('addNote');
    const toggleThemeButton = document.getElementById('toggleTheme');

    addNoteButton.addEventListener('click', () => {
        addNote();
    });

    toggleThemeButton.addEventListener('click', () => {
        toggleTheme();
    });

    loadNotes();
    applySavedTheme();
    createCircuit();

    function generateUniqueId() {
        return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }

    function addNote() {
        const noteElement = createNoteElement();
        notesContainer.appendChild(noteElement);
        saveNotes();
    }

    function createNoteElement(content = '', isDark = getCurrentTheme() === 'dark', important = false) {
        const note = document.createElement('div');
        note.classList.add('note', isDark ? 'dark' : 'light');
        if (important) note.classList.add('important');

        const controls = document.createElement('div');
        controls.classList.add('controls');

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copier';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(content).then(() => {
                alert('Contenu copié !');
            });
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => {
            note.remove();
            saveNotes();
        });

        const importantButton = document.createElement('button');
        importantButton.textContent = 'Important';
        importantButton.addEventListener('click', () => {
            note.classList.toggle('important');
            saveNotes();
        });

        controls.appendChild(copyButton);
        controls.appendChild(deleteButton);
        controls.appendChild(importantButton);
        note.appendChild(controls);

        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.placeholder = 'Écrivez votre note ici...';
        note.appendChild(textarea);

        textarea.addEventListener('input', () => {
            saveNotes();
        });

        return note;
    }

    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }

    function applySavedTheme() {
        const savedTheme = getCurrentTheme();
        applyTheme(savedTheme);
    }

    function applyTheme(theme) {
        const notes = document.querySelectorAll('.note');
        notes.forEach(note => {
            note.classList.remove('light', 'dark');
            note.classList.add(theme);
        });
        toggleThemeButton.textContent = theme === 'light' ? 'Sombre' : 'Clair';
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll('.note').forEach(noteElement => {
            notes.push({
                id: generateUniqueId(),
                content: noteElement.querySelector('textarea').value,
                isDark: noteElement.classList.contains('dark'),
                important: noteElement.classList.contains('important')
            });
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem('notes'));
        if (savedNotes) {
            savedNotes.sort((a, b) => b.important - a.important);
            savedNotes.forEach(note => {
                const noteElement = createNoteElement(note.content, note.isDark, note.important);
                notesContainer.appendChild(noteElement);
            });
        }
    }

    function createCircuit() {
        const circuit = document.querySelector('.circuit');
        const numLines = 30;
        for (let i = 0; i < numLines; i++) {
            const line = document.createElement('div');
            line.style.left = `${Math.random() * 100}vw`;
            line.style.top = `${Math.random() * 100}vh`;
            line.style.animationDelay = `${Math.random() * 5}s`;
            line.style.animationDuration = `${Math.random() * 15 + 10}s`;
            circuit.appendChild(line);
        }
    }
});