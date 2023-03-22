<?php 

namespace Models\NativeSentences;

class NativeSentencesModel extends BaseModel
{
    public function __construct($db)
    {
        $table = 'native_sentences';
        $columns = array('id' , ...);
        $primaryKeys = array('id');
        parent::__construct($db, $table, $columns, $primaryKeys);
    }
}
