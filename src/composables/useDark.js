import { ref, watchEffect } from 'vue';

const isDark = ref(typeof window !== 'undefined' && (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)));

const toggleDark = () => {
    isDark.value = !isDark.value;
};

// Singleton Side Effect: Monitor isDark and update DOM
if (typeof window !== 'undefined') {
    watchEffect(() => {
        const html = document.documentElement;
        if (isDark.value) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
}

export function useDark() {
    return { isDark, toggleDark };
}
