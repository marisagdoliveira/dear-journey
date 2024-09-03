import { useEffect } from 'react';

export const useCapitalizeFirstLetter = () => {
  useEffect(() => {
    function capitalizeFirstLetter(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    document.querySelectorAll('input[type="text"], textarea').forEach(element => {
      element.addEventListener('input', function () {
        this.value = capitalizeFirstLetter(this.value);
      });
    });

    return () => {
      document.querySelectorAll('input[type="text"], textarea').forEach(element => {
        element.removeEventListener('input', function () {
          this.value = capitalizeFirstLetter(this.value);
        });
      });
    };
  }, []);
};