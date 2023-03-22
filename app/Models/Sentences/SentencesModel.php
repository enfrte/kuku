<?php 

namespace Models\Sentences;

class SentencesModel extends BaseModel
{
    public function __construct($db)
    {
        $table = 'sentences';
        $columns = array('id' , ...);
        $primaryKeys = array('id');
        parent::__construct($db, $table, $columns, $primaryKeys);
    }
}
