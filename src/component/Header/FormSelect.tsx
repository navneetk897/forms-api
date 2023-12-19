import React, { useEffect, useState } from "react"


import "./FormSelect.scss";
import { FormDefnition, fetchFormDefinition } from "../../store/slices/formDefinitionSlice";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { selectFormDefiniton } from "../../store/slices/selectedFormSlice";



interface ModelProps {
    selectForm: (form: FormDefnition) => void;
    forms: FormDefnition[];
    formInput: string;
}




const Model: React.FC<ModelProps> = ({ selectForm, forms, formInput}: ModelProps) => {
    const orderedForm = [...forms];
    const equalPrefix = (first: string, second: string) => {
        if (formInput.length === 0) return false;
        if (first.length < second.length) return false;
        if (first.substring(0, second.length).toLowerCase() === second.toLowerCase()) {
            return true;
        }
        return false;
    }
    let pos = 0;
    for (let i = 0; i < orderedForm.length; i++) {
        if (equalPrefix(orderedForm[i].displayName, formInput)) {
            const temp = orderedForm[i];
            orderedForm[i] = orderedForm[pos];
            orderedForm[pos] = temp;
            ++pos;
        }
    }
    return (
        <div id="form-def" className="form-list">
            {orderedForm.map((form) => {
                return (
                    <div key={form.id} className="item" onClick={() => {
                        selectForm(form);
                    }}>{form.displayName}</div>
                )
            })}
        </div>
    )
}



const FormSelect: React.FC = () => {
    const [showModel, setShowModel] = React.useState<boolean>(false);
    const [formInput, setFormInput] = useState<string> ('');
    const [selectedForm, setSelectedForm] = useState<FormDefnition>();
    const forms = useAppSelector(state => state.formDefinition);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(fetchFormDefinition());
    }, [dispatch]);
    
    useEffect(() => {
        if (forms.formDefinitions.length > 0) {
            setFormInput(forms.formDefinitions[0].displayName);
            setSelectedForm(forms.formDefinitions[0]);
        }
    }, [forms]);

    useEffect(() => {
        if (selectedForm) {
            dispatch(selectFormDefiniton(selectedForm));
        }
    }, [dispatch, selectedForm]);


    const selectForm = (form: FormDefnition) => {
        setSelectedForm(form);
        setFormInput(form.displayName);
    }

    const onInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFormInput(event.target.value);
    }

    const formSelectClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setShowModel(true);
        event.stopPropagation();
    }

    document.addEventListener('click', (event: MouseEvent) => {
        const model = document.getElementById('form-def');
        if (model) {
            const isModel: boolean = model.contains(event.target as HTMLElement);
            if (!isModel && showModel) {
                setShowModel(false);
            }
        }
    })
    return (
        <div className="project-select" onClick={formSelectClick}>
            <input className="project-input" type="text" value={formInput} onChange={onInputChange}/>
            <div className="arrow-container">
                <div style={showModel? {
                    rotate: '90deg',
                    transitionDuration: '0.2s'
                }: {}} className="arrow"></div>
            </div>
           {showModel && <Model selectForm={selectForm} forms={forms.formDefinitions} formInput={formInput}/>}
        </div>
    )
}

export default FormSelect;