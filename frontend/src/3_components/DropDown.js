import React, { useState } from "react"
import { View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { styles } from "../2_services/styles"

function DropDown({ value, onChange, items, setItems, placeholder = "Type" }) {
  const [open, setOpen] = useState(false)

  return (
    <View style={styles.dropdownContainer}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={onChange}
        setItems={setItems}
        placeholder={placeholder}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.dropdownPlaceholder}
        dropDownContainerStyle={styles.dropdownList}
      />
    </View>
  )
}

export default DropDown
