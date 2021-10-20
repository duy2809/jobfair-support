import React from "react";
import axios from "axios";

export default function index() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("picture", data.picture[0])

    const res = await axios("api/file-import", {
      method: "POST",
      body: formData
    }).then(res => res.json())
    alert(JSON.stringify(res))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input ref={register} type="file" name="picture" />
      <button>Submit</button>
    </form>
  );
}
