import { langController } from "../controllers/stateControllers.js";

export default function Form(inputs, groups = [], actions = []) {

    /* The parameter "inputs" is an array of objects.
    Ex. of object: {
        tag: string ("select" or "input"),
        type: string ("range", "text"...),
        id: string,
        name: string,
        labelTextKey: string ("label_text_key"),
        min: number,
        max: number,
        value: number,
        inGroup: number of group (0 - not in group)
    }
    The parameter "groups" is an array of objects.
    Ex: {groupName: string, legendTextKey: string}

    The parameter "actions" is an array of Buttons;
    */

    const form = document.createElement('form');
    form.className = "form";

    const fieldsets = [];
    for (let group of groups) {
        const fieldset = document.createElement('fieldset');
        fieldset.id = `form__${group.groupName}`;
        fieldset.className = "fieldset form-box";
        const leg = langController.createLabel('legend', group.legendTextKey);
        fieldset.appendChild(leg);
        form.appendChild(fieldset);
        fieldsets.push(fieldset);
    }

    for (let formInput of inputs) {

        const label = langController.createLabel('label', formInput.labelTextKey);
        label.setAttribute('for', formInput.id);
        label.classList.add("form-label");

        const input = document.createElement(formInput.tag);
        input.setAttribute("id", formInput.id);
        input.className = `form-${formInput.tag}`;
        input.setAttribute("name", formInput.name);

        const inputValue = Number(formInput.value);

        if (formInput.inGroup) { fieldsets[formInput.inGroup - 1].append(label, input) }
        else {
            const formBox = document.createElement('div');
            formBox.className = "form-box";
            form.appendChild(formBox);
            formBox.append(label, input)
        }

        if (formInput.tag === "select") {
            for (let i = formInput.min; i <= formInput.max; i++) {
                let textKey;
                if (formInput.options) { textKey = formInput.options[i] }
                else { textKey = i }

                const opt = langController.createLabel('option', textKey);
                opt.setAttribute("value", i);
                if (i === inputValue) { opt.setAttribute("selected", true) }

                input.appendChild(opt);
            }
        }
        if (formInput.type === "range") {

            const datalistID = `${formInput.name}--range-marks`;

            input.setAttribute("list", datalistID);

            const rangeDatalist = document.createElement('datalist');
            rangeDatalist.id = `${formInput.name}--range-marks`;
            for (let r = formInput.min; r <= formInput.max; r++) {
                rangeDatalist.innerHTML += `<option class="transparent" value=${r} label=${r}></option>`;
            }
            input.insertAdjacentElement('afterend', rangeDatalist);
            rangeDatalist.childNodes[inputValue - 1].classList.toggle('transparent');

            input.classList.add(formInput.type);
            label.classList.add("no-display");
            input.setAttribute("type", formInput.type);
            input.setAttribute("min", formInput.min);
            input.setAttribute("max", formInput.max);
            input.setAttribute("value", inputValue);
            // const output = document.createElement('output');
            // output.className = "range-output";
            // label.appendChild(output);
            // output.textContent = input.value;
            let valueBefore = inputValue;
            input.addEventListener("input", () => {
                if (rangeDatalist && input.value != valueBefore) {
                    input.setAttribute("value", input.value);
                    rangeDatalist.childNodes[input.value - 1].classList.toggle('transparent');
                    if (valueBefore > 0) { rangeDatalist.childNodes[valueBefore - 1].classList.toggle('transparent') }
                }
                valueBefore = input.value;
                //output.textContent = input.value;
            });
        }
    }
    if (actions) {
        const formActionsContainer = document.createElement('div');
        formActionsContainer.className = 'form-actions';
        form.appendChild(formActionsContainer);
        for (let button of actions) { formActionsContainer.appendChild(button) }
    }
    return form
}