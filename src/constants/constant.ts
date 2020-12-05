export const constant = {
    // user Role for login and other Important //
    user: {
        userType: 1
    },

    regEx: {
        alphabetOnlyRegEx: /^[A-Za-z -]+$/,
        numberOnlyRegEx: /[^0-9]*/,
        emailRegEx: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
        // passwordRegEx: '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}',
        passwordRegEx:
            '^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z!@#$%^&*()_+-?><:~]{6,}$',
        usPhoneRegEx: /^.{10,}$/,
        // usPhoneRegEx: /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/i,
        zipRegEx: '^[0-9]{5}([- /]?[0-9]{4})?$',
        ssnRegEx: /^\d{3}-?\d{2}-?\d{4}$/,
        einRegEx: /^\d{3}-?\d{2}-?\d{4}$/,
        youTubeLinkRegEx: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
        name : /^(?!\s)[a-zA-Z0-9.,/+=_()'"!@#$%^&*\s-]*$/,
    },

    ToastConfig: {
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right',
        preventDuplicates: true
    },

    searchSpecific: {
        componentRestrictions: {
            country: ['USA']
        }
    },

    api: {
        key: 'AIzaSyAJnDvfb4o372s6og8i70DPNAcD9FpnAT8'
    },

    function: {
        numberOnly: event => {
            const charCode = event.which ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        },

        validateNumber: event => {},

        alphabetOnly: event => {
            const charCode = event.which ? event.which : event.keyCode; // 32 is ASCII code of space bar
            if (
                charCode > 31 &&
                charCode > 32 &&
                (charCode < 65 || charCode > 90) &&
                (charCode < 97 || charCode > 122)
            ) {
                return false;
            }
            return true;
        },

        isNumberOnly: event => {
            const charCode = event.which ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        },
        //    addLbs:event=> {
        //     const parts = event.toString().split(" lbs")
        //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //     return parts.join(" lbs")
        // },

        addCommasToPhone: mobileNumber => {
            let m = '(';
            for (let i = 0; i < 10; i++) {
                if (i === 3) {
                    m = m + ') ';
                }
                if (i === 6) {
                    m = m + '-' + mobileNumber[i];
                } else {
                    m = m + mobileNumber[i];
                }
            }
            return m;
        },

        removeCommasFromPhone: mobileNumber => {
            return mobileNumber.replace(/\D/g, '');
        },

        modifyEnterToTab: event => {
            if (event.keyCode === 13) {
                // tslint:disable-next-line: no-unused-expression
                event.keyCode === 9;
            }
        },

        keyDownFunction: event => {
            if (event.keyCode === 13) {
                const inputs = Array.prototype.slice.call(
                    document.querySelectorAll('input')
                );
                const index =
                    (inputs.indexOf(document.activeElement) + 1) %
                    inputs.length;
                const input = inputs[index];
                input.focus();
                input.select();
            }
        }
    }
};
