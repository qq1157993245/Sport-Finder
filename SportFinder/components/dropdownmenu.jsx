import { Text, View } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdownmenu = ({items, value, setValue, placeholder, title, ...props}) => {
  const [open, setOpen] = useState(false);

  return (
    <View className='mt-8'>
      <Text className="text-base text-gray-100 font-pmedium mb-1">{title}</Text>
      <DropDownPicker
        {...props}
        listMode='SCROLLVIEW'
        items={items}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        style={{
          backgroundColor:'black',
          borderColor: 'grey',
          height: 60,
        }}
        textStyle={{
          fontSize: 20,
          color:'white',
        }}
        dropDownContainerStyle={{
          backgroundColor: 'black',
          borderColor: 'grey',
          maxHeight:250,
        }}
        arrowIconStyle={{
          tintColor:'white',
        }}
      />
    </View>
  );
};

export default Dropdownmenu;
