import * as React from "react";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import DeleteTrashButton from "../../../components/DeleteTrashButton";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  putRoomType,
  createRoomType,
  getRoomType,
  clearRoomType,
} from "../../../redux/RoomTypes/Actions/actions";
import Loading from "../../../components/Loading";

export default function ModalRoomTypesEdit({ control, id, edit = false }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({ name: "", description: "" });
  const [error, setError] = useState({ name: "", description: "" });
  const { selectedRoomType } = useSelector((state) => state.roomTypesReducer);

  const closeModal = (e) => {
    if (e) e.preventDefault();
    dispatch(clearRoomType());
    setLoading(true);
    control(false);
  };
  const saveChanges = (e) => {
    const errors = { name: "", description: "" };
    e.preventDefault();
    //Validation
    if (inputs.name.trim() === "") errors.name = "Type is required.";
    else if (inputs.name.length < 5)
      errors.name = "Type must be at least 5 characters long.";
    if (inputs.description.trim() === "")
      errors.description = "Description is required";
    else if (inputs.description.trim().length < 10)
      errors.description = "Description must be at least 10 characters long.";
    setError({ ...errors });
    if (errors.name !== "" || errors.description !== "") return;
    //Saving changes
    if (edit) {
      dispatch(putRoomType(id, inputs))
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      dispatch(createRoomType(inputs)).then((res) => console.log(res));
    }
    setInputs({ name: "", description: "" });
    setLoading(true);
    control(false);
  };

  useEffect(() => {
    if (edit) {
      dispatch(getRoomType(id)).catch((err) => console.log(err));
    } else setLoading(false);
  }, []);

  useEffect(() => {
    if (edit && selectedRoomType.name) {
      console.log(selectedRoomType.name);
      setInputs({ ...selectedRoomType });
      setLoading(false);
    }
  }, [selectedRoomType]);

  const handleChange = (e) => {
    setError((prevValue) => ({
      ...prevValue,
      [e.target.name]: "",
    }));
    setInputs((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <section className="fixed flex items-center justify-center z-[100] inset-0 bg-[rgba(12,12,12,0.3)]">
      {" "}
      <div className="flex flex-col px-16 py-9 justify-between pt-11 pb-7 bg-white dark:bg-[#333333] dark:border-gray-200/30 dark:border rounded-3xl w-[95%] max-w-[626px] max-md:px-5 shadow-md shadow-slate-600">
        <Loading state={loading}>
          {" "}
          <h1 className="text-4xl font-semibold tracking-wide text-neutral-500 max-md:max-w-full">
            {" "}
            {edit ? "Room Type Customization" : "Room Creation"}
          </h1>{" "}
          <hr className="shrink-0 mt-3 h-px dark:bg-slate-200 border-slate-300 bg-black border border-black border-solid max-md:max-w-full" />{" "}
          <div className="mt-5 max-md:max-w-full">
            {" "}
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              {" "}
              <div className="flex flex-col w-9/12 max-md:ml-0 max-md:w-full">
                {" "}
                <div className="flex flex-col grow text-base font-medium tracking-normal dark:text-white  text-gray-700 max-md:mt-10">
                  {" "}
                  <InputField
                    type={"text"}
                    label="Room Type Name"
                    name={"name"}
                    value={inputs.name}
                    handler={handleChange}
                    error={error.name}
                  />{" "}
                  <InputField
                    type={"textarea"}
                    label="Description"
                    name={"description"}
                    value={inputs.description}
                    handler={handleChange}
                    error={error.description}
                  />{" "}
                </div>{" "}
              </div>{" "}
              {edit && <DeleteTrashButton data={inputs} control={closeModal} />}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-5 self-center mt-14 text-base font-semibold tracking-normal text-center text-white max-md:mt-10">
            {" "}
            <div className="flex flex-col flex-1 justify-center">
              {" "}
              <Button className="bg-indigo-900" action={saveChanges}>
                Save Changes
              </Button>{" "}
            </div>{" "}
            <div className="flex flexcol flex-1 justify-center whitespace-nowrap">
              {" "}
              <Button
                className="bg-amber-700 px-12 py-4 max-md:px-5"
                action={closeModal}
              >
                {" "}
                Cancel{" "}
              </Button>{" "}
            </div>{" "}
          </div>{" "}
        </Loading>
      </div>{" "}
    </section>
  );
}
