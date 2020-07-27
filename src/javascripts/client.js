var i = 0;
var count = 1;
/*
* TODO meter la fecha en el server-side
* */

function previewFile() {
    var filePreview = document.querySelector('#image');
    var file    = document.querySelector('.file-input').files[0];
    var reader  = new FileReader();
    var image_base_64;

    reader.onloadend = function () {
        image_base_64 = reader.result.split(",")[1];
        filePreview.src = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        filePreview.src = "";
    }
}

function inputImage() {
    var button = document.getElementById('input-label');
    button.click();
}

function removeAddButton(element) {
    element.removeChild(
        element.querySelector('.add_button')
    );
}

function insertPreviousAddButton(element) {
    var button = element.querySelector('.add_button');
    if (button) {
        element.parentNode.previousElementSibling.querySelector('.add_button_container').append(button.cloneNode(true));
    }

}

function createExercise(exercise) {
    var clone = exercise.parentNode.parentNode.cloneNode(true);
    count++; i++;
    clone.id = "exercise" + exercise.id.split("_")[0] + "_" + i.toString();
    clone.querySelector('.duration').value = '';
    clone.querySelector('.duration_unit').checked = false;
    exercise.parentNode.parentNode.parentNode.appendChild(clone);
    removeAddButton(exercise);
}

function removeExercise(element) {
    if (count > 1) {
        insertPreviousAddButton(element);
        element.parentNode.parentNode.removeChild(element.parentNode);
        i--;
        count--;
    }
}

function processExercises() {
    var exercisesHTML = document.querySelectorAll('.exercise_template');
    var exercisesArray = [];
    var duration;
    for (var i = 0; i < exercisesHTML.length; i++) {
        if (exercisesHTML[i].querySelector('.duration').value != "") {
            if (exercisesHTML[i].querySelector('.duration_unit').checked) {
                duration = exercisesHTML[i].querySelector('.duration').value + '"';
            } else {
                duration = exercisesHTML[i].querySelector('.duration').value + " rep";
            }
        } else {
            duration = "";
        }
        exercisesArray[i] = [
            exercisesHTML[i].querySelector('.exercise_name').value,
            duration
        ];
    }
    return exercisesArray;
}

function descriptionToArray(description) {
    var descriptionArray = description.split('\n');
    return descriptionArray;
}

function getGeneralInformation() {
    const nombre = document.getElementById('name');
    return {
        name: nombre.value,
        description: descriptionToArray(description.value),
    };
}

function getImage() {
    var imagePreview = document.querySelector('#image');
    var image = imagePreview.src.split(",")[1];
    return image;
}

function arrengeDateDigit(date) {
    if (date < 10) {
        date = ("0" + date);
    }
    return date;
}

function getDate() {
    var date = new Date();
    const dia = arrengeDateDigit(date.getDate());
    const mes = arrengeDateDigit(date.getMonth() + 1);
    const año = date.getFullYear();
    return (dia + "-" + mes + "-" + año);
}

function submitForm() {
    var generalInformation = getGeneralInformation();
    var exercisesArray = processExercises();
    var img = getImage();
    var fecha = getDate();
    var form_data = {
        name: generalInformation.name,
        description: generalInformation.description,
        image: img,
        exercises: exercisesArray,
        date: fecha,
    };
    console.log(form_data);
    var http = new XMLHttpRequest();
    var url = "https://ipm1920-p3.herokuapp.com/";
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/text;charset=UTF-8");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            //aqui obtienes la respuesta de tu peticion
            if (http.responseText != null) {
                alert(http.responseText);
            }
        } else {
            if (http.readyState == 4 && http.status == 0) {
                alert("Conexion perdida con el servidor");
            }
        }
    }
    http.send(JSON.stringify(form_data));
}
