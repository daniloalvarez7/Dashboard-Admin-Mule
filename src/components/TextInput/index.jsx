/* eslint-disable react/prop-types */
import React from "react";
import { Field, ErrorMessage } from "formik";

const TextInput = ({
  label,
  name,
  placeholder,
  rows,
  labelAlign = "center",
}) => {
  const inputField = rows ? (
    <Field
      as="textarea"
      rows={rows}
      name={name}
      placeholder={placeholder}
      className="border mt-4 mr-4 ml-4 py-2 px-3   text-gray-700 bg-white rounded-md"
    />
  ) : (
    <Field
      type="text"
      name={name}
      placeholder={placeholder}
      className="border mt-4 mr-4 ml-4 py-2 px-3   text-gray-700 bg-white rounded-md"
    />
  );

  return (
    <div className={`flex flex-col w-full mt-4`}>
      <label
        className={`text-bold text-lg dark:text-white ${
          labelAlign === "center" ? "" : "text-left pl-5"
        }`}
      >
        {label}
      </label>
      {inputField}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 mb-2 text-sm"
      />
    </div>
  );
};

export default TextInput;
