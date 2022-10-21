const choose_file = document.querySelector("input[type='file']");
const mainVideo = document.querySelector(".mainVideo");
const fileName = document.querySelector(".file_name input[type='text']");
const insert_btn = document.querySelector(".insert_btn");
const selectMenu = document.querySelector(".save_as select");
let time_element;

choose_file.addEventListener("change",()=>{
    const file = choose_file.files[0];
    const url = URL.createObjectURL(file);
    mainVideo.src = url;
    fileName.value = file.name.split(".")[0];
})


insert_btn.addEventListener("click",()=>{
    if (time_element != undefined) {
        const currentTime = mainVideo.currentTime;
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        let currentHours = Math.floor(currentMin / 60);
        let currentMiliSec = "000";

        currentMin > 59 ? currentMin - currentHours * 60 : currentMin;
        currentMin < 10 ? currentMin = "0"+currentMin : currentMin;
        currentSec < 10 ? currentSec = "0"+currentSec : currentSec;

        time_element.value = `${currentHours}:${currentMin}:${currentSec}.${currentMiliSec}`;

    }
})


document.addEventListener("click",(e)=>{
    if (e.target.classList.contains("close")) {
        e.target.closest(".subtitle_box").remove();
    }
    if (e.target.classList.contains("subBtn")) {
        save_file();
    }
    if (e.target.classList.contains("add_before")) {
        add_new("beforebegin",e.target.closest(".subtitle_box"));
    }
    if (e.target.classList.contains("add_after")) {
        add_new("afterend",e.target.closest(".subtitle_box"));
    }
    if (e.target.getAttribute("data-input") == "timestamp") {
        time_element = e.target;
    }
})

function add_new(position,target) {
    const subtitle_box_html = ` <div class="subtitle_box">
                                    <label>
                                        <i> class="fa-solid fa-plus add_before"></i>
                                        <i> class="fa-solid fa-xmark close"></i>
                                    </label>
                                    <div class="input_field">
                                        <textarea> class="caption_text"></textarea>
                                        <input type="text" class="start" placeholder="00:00:00" data-input="timestamp">
                                        <input type="text" class="end" placeholder="00:00:00" data-input="timestamp">
                                    </div>
                                    <label class="bottom_label">
                                        <i> class="fa-solid fa-plus add_after"></i>
                                    </label>
                                </div>`;
    target.insertAdjacentHTML(`${position}`,subtitle_box_html);
}

function save_file() {
    const all_captions = [];
    const subtitle_boxs = document.querySelectorAll(".subtitle_box");
    subtitle_boxs.forEach((e)=>{
        all_captions.push({
            text: `${e.querySelector(".caption_text").value}`,
            start: `${e.querySelector(".start").value}`,
            end: `${e.querySelector(".end").value}`,
        });
    });
    let output = "";
    if (selectMenu.value == ".srt" || selectMenu.value == ".sbv") {
        all_captions.forEach((elem)=>{
            output+=`${elem.start},${elem.end}\n${elem.text}\n`;
        })
    }else{
        output+= `WEBVTT\n`;
        all_captions.forEach((elem)=>{
            output+=`${elem.start} --> ${elem.end}\n${elem.text}\n`;
        })
    }
    const blob = new Blob([output],{type:"txt/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.value + selectMenu.value;
    link.click();
    link.remove();
}
